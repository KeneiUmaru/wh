const { readFileSync } = require("fs");
const database = require("../modules/database");
const Database = new database();
const path = require("path");

/**
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
*/
async function routes(fastify, options) {	
    fastify.get("/:scriptId", async (request, reply) => {
        const { scriptId } = request.params;
        
        const script = await Database.GetScript(scriptId);
        if (!script) {
            return reply.status(400).send({ error: "This script does not exist" });
        }

        if (script.Roblox) {
            if (!request.headers["roblox-game-id"] && !request.headers["roblox-session-id"]) {
                return reply.status(400).send({ error: "Unauthorised access" });
            }
        }

        reply.send(readFileSync(path.join(__dirname, `../../scripts/${script.id}.lua`), "utf-8"));

        try {
            await Database.IncrementScriptDownloads(script.id);
        } catch (er) {
            console.log(er);
        }
    });
}

module.exports = routes;