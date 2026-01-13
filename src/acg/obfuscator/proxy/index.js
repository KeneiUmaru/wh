const { readFileSync } = require("fs");
const path = require("path");
const crypto = require("crypto");
const str = require("../constant/");
const { Random } = require("random");

const names = [
    "RETURN_ITER_KEY", 
    "PROXY_INDEX_KEY", 
    "RETURN_INDEX_KEY", 
    "PROXY_NEWINDEX_KEY_1", 
    "PROXY_NEWINDEX_KEY_2", 
    "CALL_KEY", 
    "RETURN_CALL_KEY",
    "NAMECALL_KEY",
    "RETURN_NAMECALL_KEY",
    "ADD_KEY",
    "RETURN_ADD_KEY",
    "CONCAT_KEY",
    "RETURN_CONCAT_KEY",
    "SUB_KEY",
    "RETURN_SUB_KEY"
];

const metamethods = [
    "__metatable",
    "__tostring",
    "__iter",
    "__len",
    "__lt",
    "__le",
    "__index",
    "__newindex",
    "__call",
    "__namecall",
    "__add",
    "__concat",
    "__sub"
]

const metamethod = {};
for (const v of metamethods) {
    metamethod[v] = str(v);
}

module.exports = function() {
    const random = new Random();
    let proxy = readFileSync(path.join(__dirname, "proxy.lua"), "utf-8");
    let check = readFileSync(path.join(__dirname, "check.lua"), "utf-8");
    
    for (const v of names) {
        const value = random.int(1000, 9999999)
        proxy = proxy.replace(new RegExp(`"${v}"`, "g"), `(OBFUSCATE_INT(${value}))`)
        check = check.replace(new RegExp(`"${v}"`, "g"), `(OBFUSCATE_INT(${value}))`)
    }

    for (const v of metamethods) {
        proxy = proxy.replace(new RegExp(`.${v}`, "g"), `[${metamethod[v]}]`);
    }

    const ProxyName = `a${crypto.randomUUID().split("-").join("").slice(0, 5)}b`

    proxy = proxy.replace(/PROXY/g, ProxyName);
    check = check.replace(/PROXY/g, ProxyName);

    return { proxy, check }
}
