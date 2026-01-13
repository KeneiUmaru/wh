const { readFileSync } = require("fs");
const path = require("path");
const acg = require("../acg/");

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = async function(config, keyGUI) {
    return new Promise(async (resolve, reject) => {
        let client = readFileSync(path.join(__dirname, "../../client/client.lua"), "utf-8");
        for (let [i,v] of Object.entries(config)) {
            client = client.replace(new RegExp(escapeRegExp(i), "g"), `${typeof(v) == "string" ? `"${v}"` : v}`);
        }

        if (!keyGUI) {
            client = client.replace(/LS_IMPORT\(\"GUI.lua\"\)/, `return print(LS_ENCSTR("[*] You need to define a License Key. Example: script_key='Key Here'"));`);
        }
        
        if (process.platform !== "win32") {
            client = client.replace(/http:\/\/127.0.0.1:8081\/auth\//g, `https://securelua.com/auth/${config._URL_TOKEN}/`);
            client = client.replace(/http:\/\/127.0.0.1:8081\//, `https://securelua.com/`); // used for https://securelua.com/auth/headers
            client = client.replace(/RequestFunction.=.require\(LS_ENCSTR\("@lune\/net"\)\)\.request;/, "return;");
        } else {
            client = client.replace(/http:\/\/127.0.0.1:8081\/auth\//g, `http://127.0.0.1:8081/auth/${config._URL_TOKEN}/`);
        }

        /*
        client = client.replace(/http:\/\/127.0.0.1:8081\/auth\//g, `https://securelua.com/auth/${config._URL_TOKEN}/`);
        client = client.replace(/http:\/\/127.0.0.1:8081\//, `https://securelua.com/`); // used for https://securelua.com/auth/headers
        client = client.replace(/RequestFunction.=.require\(LS_ENCSTR\("@lune\/net"\)\)\.request;/, "return;");
        */
        
        resolve(acg(client, true));
    });
}
