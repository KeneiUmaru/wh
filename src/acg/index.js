const { readFileSync } = require("fs");
const { randomUUID } = require("crypto");

const str = require("./obfuscator/constant");
const amg = require("./obfuscator/amg");
const proxything = require("./obfuscator/proxy");
const { Random } = require("random");
const { performance } = require("perf_hooks");
const random = new Random();
const { global_loader_version } = require("../config.json");

const luamin = require("./luamin.js");
const luaparse = require("./luaparse");
const path = require("path");

function debug(context, ...any) {
    let t = new Date();
    console.log(`[${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}]${context ? ` [${context}]`: ""}`, ...any);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

module.exports = async function(Script, isdebug, fingerprint) {
    return new Promise(async (resolve, reject) => {
        function MacroArgCheck(node, index, type, required) {
            required = required || true;
            
            const Argument = node.arguments[index];
            if (!Argument && required) {
                return;
            }

            if (Argument.type !== type) {
                reject(`JSEC:${node.loc.start.line}: invalid argument #${index + 1} to '${node.base.name}' (expected ${type} got ${Argument.type})`);
                return true;
            }
        }

        const Now = performance.now();
        let Varcount = 0;
        let Protected = [];
        let AlreadyProtected = new Map();
        let AlreadyProtectedGlobals = new Map();
        let CompilerExpr = {};
        const Info = {};

        try {
            luaparse.parse(Script, {
                locations: true,
                luaVersion: "5.1",
                encodingMode: "pseudo-latin1",
                ranges: true
            });
        } catch (er) {
            return reject(er.toString());
        }
        
        let BackupScript = Script;
        let ScriptVariableCount = 0;

        const ProxyStorage = {};
        const DataStore = {};

        luaparse.parse(Script, { 
            locations: true,
            luaVersion: "5.1",
            encodingMode: "pseudo-latin1",
            ranges: true,
            onCreateNode: (node) => {
                switch (node.type) {
                    case "LocalStatement":
                        ScriptVariableCount++;
                        break;
                    case "CallExpression":
                        if (!node.base || !node.arguments) break;

                        if (node.base.name == "LS_RANDOMINT") {
                            const StorageKey = node.arguments[0];
                            if (MacroArgCheck(node, 0, "StringLiteral")) return;

                            const Int = random.int(1, 999999);
                            DataStore[StorageKey.value] = Int
                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), Int);
                        }

                        if (node.base.name == "LS_GETSTORAGE") {
                            const StorageKey = node.arguments[0];
                            if (MacroArgCheck(node, 0, "StringLiteral")) return;

                            const Value = DataStore[StorageKey.value];
                            if (!Value)
                                reject("Storage key does not exist");

                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), Value);
                            break;
                        }

                        if (node.base.name === "LS_RANDOMISE") {
                            let Function = node.arguments[0];
                            if (MacroArgCheck(node, 0, "FunctionDeclaration")) return;

                            shuffleArray(Function.body);
                            const statements = [];
                            for (const { range } of Function.body) {
                                statements.push(BackupScript.slice(range[0], range[1]));
                            }

                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), statements.join("\n"));
                            break;
                        }

                        if (node.base.name === "LS_ENCSTR") {
                            let ToEncrypt = node.arguments[0];
                            let InLine = { value: true };

                            if (MacroArgCheck(node, 0, "StringLiteral") || MacroArgCheck(node, 1, "BooleanLiteral", false)) return;
                            
                            if (AlreadyProtected.has(ToEncrypt.value)) {
                                Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), AlreadyProtected.get(ToEncrypt.value));
                                break;
                            }

                            let VM = str(ToEncrypt.value, isdebug, fingerprint);
                            if ((!InLine || !InLine.value) && ScriptVariableCount < 150) {
                                Protected.push(`local ACE_STR_${Varcount} = ${VM}`);
                                Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `ACE_STR_${Varcount}`);
                            } else {
                                Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `${VM}`);
                            }

                            AlreadyProtected.set(ToEncrypt.value, (!InLine || !InLine.value) && ScriptVariableCount < 150 ? `ACE_STR_${Varcount}` : VM);
                            Varcount++;
                            break;
                        }

                        if (node.base.name === "LS_HIDEGLOBAL") {
                            const ToEncrypt = node.arguments[0];

                            if (MacroArgCheck(node, 0, "Identifier")) return;

                            if (AlreadyProtectedGlobals.has(ToEncrypt.name)) {
                                Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), AlreadyProtectedGlobals.get(ToEncrypt.name));
                                break;
                            }

                            const VM = str(ToEncrypt.name, isdebug, fingerprint);

                            Protected.push(`local ACE_GLOBAL_${Varcount} = _env[${VM}]`);
                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `ACE_GLOBAL_${Varcount}`);
                            AlreadyProtectedGlobals.set(ToEncrypt.name,  `ACE_GLOBAL_${Varcount}`);
                            Varcount++;
                            break;
                        }

                        if (node.base.name === "LS_JUNK_CODE") {
                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `${str(randomUUID().slice(0, 4), isdebug, fingerprint)}`);
                            break;
                        } 

                        if (node.base.name == "LS_PROXY") {
                            let ID = node.arguments[0];

                            if (MacroArgCheck(node, 0, "NumericLiteral")) return;
                            ID = ID.value;

                            const Data = proxything();
                            ProxyStorage[ID] = Data;

                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), Data.proxy);
                            break;
                        }

                        if (node.base.name == "LS_PROXY_CHECK") {
                            let ID = node.arguments[0];

                            if (MacroArgCheck(node, 0, "NumericLiteral")) return;
                            ID = ID.value;

                            const Data = ProxyStorage[ID];
                            if (!Data) return reject("LS_PROXY_CHECK, proxy does not exist");

                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), Data.check);
                            break;
                        }

                        if (node.base.name === "LS_IMPORT") {
                            let Name = node.arguments[0];

                            if (MacroArgCheck(node, 0, "StringLiteral")) return;
                            Name = Name.value;

                            const src = readFileSync(path.join(__dirname, `../../client/libraries/${Name}`), "utf-8");
                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), src);
                            break;
                        }

                        if (node.base.name === "CMP_EXPR") {
                            let Name = node.arguments[0];
                            let Value = node.arguments[1];

                            if (MacroArgCheck(node, 0, "StringLiteral") || MacroArgCheck(node, 1, "StringLiteral")) return;

                            CompilerExpr[Name.value] = Value.value;
                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), "");
                            break;
                        }

                        break;
                    case "Identifier":
                        if (CompilerExpr[node.name]) {
                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `"${CompilerExpr[node.name]}"`)
                        }
                        break;
                    default: 
                        break;
                }
            },
        });

        BackupScript = Script;
        
        Script = Script;
        BackupScript = Script;

        function ApplyCF(body) {
            //console.log(body);

            let Index = 0;
            const Statements = [];
            const LocalStatements = [];

            for (let node of body) {
                if (node.type == "LocalStatement" || node.type == "FunctionDeclaration") {
                    LocalStatements.push(BackupScript.slice(node.range[0], node.range[1]));
                    Index++;
                    continue;
                } else if (node.type === "CallStatement" && node.expression.type == "CallExpression" && node.expression.base.name === "LS_CFINNER") {
                    let Function = node.expression.arguments[0];
                    if (MacroArgCheck(node.expression, 0, "FunctionDeclaration")) return;

                    Statements.push({ statement: ApplyCF(Function.body), Old: Index, New: random.int(1, 999999) });
                    Index++;
                    continue;
                }

                Statements.push({ statement: BackupScript.slice(node.range[0], node.range[1]), Old: Index, New: random.int(1, 999999) });
                Index++;
            }

            let Loop = readFileSync(path.join(__dirname, "/obfuscator/cf/include.lua"), "utf-8");
            let Raw = Object.values(Statements).sort((a, b) => a.New - b.New);
            const End = Raw[0].New - random.int(1, Raw[0].New - 1);
            let VMShit = "if _ENUM <= 0 then\nreturn;\n";
            const PC = random.int(1, 9999999);
            Raw.forEach((v, i) => {
                const Next = Raw.find(a => a.Old == v.Old + 1); 
                let OhGod = "";
                const Amount = random.int(1, 3);
                for (let i=1; i <= Amount; i++) {
                    let Bigger = random.int(0, 1) == 1;
                    OhGod += `if _ENUM ${Bigger ? "<=" : ">="} OBFUSCATE_INT(${v.New + (Bigger ? random.int(1, 100) : -random.int(1, 100)) + PC}, _PC) then\n`;
                }
                VMShit += `elseif _ENUM <= OBFUSCATE_INT(${v.New + PC}, _PC) then\n${OhGod} ${v.statement.trim()} _ENUM = OBFUSCATE_INT(${(Next?.New || End)}); ${"end\n".repeat(Amount)}\n\n${i === Raw.length - 1 ? "end" : ""}`;
            });

            Loop = Loop.replace("--Opcodes", VMShit)
                .replace("--Variables", LocalStatements.join("\n"))
                .replace("_START", Statements[0].New)
                .replace("_END", End)
                .replace("PC_START", PC)
                .replace(/_PC/g, `P_${random.int(1, 9999)}_`)
                .replace(/_ENUM/g, `E_${random.int(1, 9999)}_`);
        
            return Loop;
        }

        luaparse.parse(Script, { 
            locations: true,
            luaVersion: "5.1",
            encodingMode: "pseudo-latin1",
            ranges: true,
            onCreateNode: (node) => {
                switch (node.type) {
                    case "CallExpression": {
                        if (node.base.name === "LS_CF") {
                            let Function = node.arguments[0];
                            if (MacroArgCheck(node, 0, "FunctionDeclaration")) return;

                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), ApplyCF(Function.body));
                            break;
                        }
                    }
                }
            },
        });

        Script = Script.replace("--#TEMPVARS", Protected.sort(() => Math.random() - 0.5).join("\n"));

        for (let match of Script.matchAll(/OBFUSCATE_INT\((\d+)\)/g)) {
            Script = Script.replace(match[0], await amg(parseInt(match[1])));
        }

        for (let match of Script.matchAll(/OBFUSCATE_INT\((\d+), ([_\w\d]+)\)/g)) {
            Script = Script.replace(match[0], await amg(parseInt(match[1]), false, match[2]));
        }

        Info.Time = performance.now() - Now;

        Script = Script.replace("local function LS_CF(f) return f() end;", "");
        Script = Script.replace("local function LS_CFINNER(f) return f() end;", "");
        Script = Script.replace("local function LS_ENCSTR(r) return r; end;", "");
        Script = Script.replace("local function OBFUSCATE_INT(r) return r; end;", "");
        Script = Script.replace("local function LS_HIDEGLOBAL(r) return r; end;", "");
        Script = Script.replace("local function LS_PROXY() end;", "");
        Script = Script.replace("local function LS_PROXY_CHECK() end;", "");
        Script = Script.replace("local function LS_RANDOMISE(f) return f() end;", "");
        
        try {
            Script = luamin.Minify(Script, {
                RenameVariables: true,
                RenameGlobals: false,
                SolveMath: false
            });
        } catch (er) {
            return reject("Luamin error (prob incorrect macro usage): " + er.toString());
        }

        let hash = crypto.randomUUID();
        let runtimevars = [
            "AUTH_START",
            "AUTH_USER_LICENSE",
            "AUTH_USER_DISCORD_ID",
            "AUTH_USER_HWID",
            "AUTH_LOADER_HASH",
            "AUTH_USER_EXPIRE",
            "AUTH_STORAGE",
            "AUTH_INTEGRITY",
            "AUTH_INTEGRITY_KEY",
            "AUTH_SECURE_REQUEST",
            "AUTH_CHECK_HTTP_PROXY"
        ]

        shuffleArray(runtimevars);

        Script = `--[[\n\tSecure Lua Loader (${global_loader_version})\n\t\tHash: ${hash}\n\t\tGenerated in: ${(Info.Time / 1000).toFixed(2)}s\n\t\tSize: ${(Script.length / 1000).toFixed(2)} kb\n\tInsert your script below the loader and obfuscate using Luraph (enable "Static Envionment" and "Disable Line Information")\n--]]\n\nlocal AUTH_SILENT_LAUNCH = false; -- Set to true for a silent launch (stop printing to console, and no UI)\nlocal ${runtimevars.join(", ")};\ndo\t${Script} end\n\n-- Your script here`;
        debug("ACG", `Loader Generated (size: ${(Script.length / 1000).toFixed(2)}kb) (took: ${(Info.Time / 1000).toFixed(2)}s)`)

        resolve({
            source: Script,
            hash,
            generatedIn: Math.floor(Info.Time / 1000).toFixed(2)
        });
    });
}