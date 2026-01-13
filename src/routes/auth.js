const json = require("../modules/json");
const database = require("../modules/database");
const schemas = require("../modules/schemas");
const webhook = require("../modules/webhook");
const mcscript = require("../modules/mcscript");
const { global_loader_version } = require("../config.json");

const WebhookHandler = new webhook();
const Database = new database();
const Blocked = new Set();
const HWIDBlock = new Set();
const Timing = new Map();

async function Middleman(request, reply) {
    for (let [i,v] of Object.entries(request.raw.headers)) {
        if (i.toLowerCase().match(/^\w+\-fingerprint$/)) {
            request.Fingerprint = v;
        }
    }

    if (process.platform !== "win32") {
        if (!request.Fingerprint) {
            Blocked.add(request.IPAddress);
            try {
                await WebhookHandler.RequestFail(JSON.stringify(request.headers, null, 4));
            } catch (er) {
                console.log(er);
            }
            return reply.status(500);       
        }

        const UserAgent = request.headers["user-agent"];
        if (UserAgent && UserAgent.includes("lune")) {
            Blocked.add(request.IPAddress);
            try {
                await WebhookHandler.RequestFail(JSON.stringify(request.headers, null, 4));
            } catch (er) {
                console.log(er);
            }
            return reply.status(500);
        }
    }

    if (Blocked.has(request.IPAddress)) {
        return reply.status(500);
    }

    if (HWIDBlock.has(request.Fingerprint)) {
        return reply.status(500);
    }
}

/**
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
*/
async function routes(fastify, options) {	
    fastify.get("/:urlToken/:projectID/:key/:token/:second_token/:third_token/:fourth_token", { preHandler: Middleman, schema: { params: schemas.AuthParamSchema } }, async (request, reply) => {
        const { urlToken, projectID, key, token, second_token, third_token, fourth_token } = request.params;

        const Project = await Database.GetProject(projectID);
        if (!Project) {
            return reply.status(500);
        }
        
        if (Project.LoaderConfig._URL_TOKEN !== urlToken) {
            return reply.status(500);
        }

        if (Project.LoaderVersion !== global_loader_version) {
            return reply.status(500);
        }

        let License = await Database.GetLicense(projectID, key);
        if (!License) {
            try {
                await Database.IncrementThreats(Project.id);
                await WebhookHandler.NoKeyExecution(Project.Webhook, Project);
                await WebhookHandler.NoKeyExecution("", Project);
            } catch (er) {
                console.log(er);
            }
            Timing.delete(request.Fingerprint);
            return reply.status(500);
        }

        /*
                const TimingData = Timing.get(request.Fingerprint);
        if (!TimingData) {
            await Database.UpdateLicenseBlacklist(projectID, License.Key, true, "Automatic blacklist by Server");
            await WebhookHandler.SystemBlacklist(Project.Webhook, Project, License, "Code 0x1");
            await WebhookHandler.SystemBlacklist("", Project, License, "Code 0x1");
            
            HWIDBlock.add(request.Fingerprint);
            Blocked.add(request.IPAddress);

            return reply.status(500);
        }

        Timing.delete(request.Fingerprint);

        const TimingDuration = Date.now() / 1000 - TimingData / 1000; 
        if (TimingDuration >= 200) {
            await Database.UpdateLicenseBlacklist(projectID, License.Key, true, "Automatic blacklist by Server");
            await WebhookHandler.SystemBlacklist(Project.Webhook, Project, License, "Code 0x1");
            await WebhookHandler.SystemBlacklist("", Project, License, Buffer.from(TimingDuration.toString()).toString("base64"));

            HWIDBlock.add(request.Fingerprint);
            Blocked.add(request.IPAddress);

            return reply.status(500);
        }
            */

        if (License.ExpireAt && Date.now() > (License.ExpireAt * 1000)) {
            await Database.DeleteLicense(projectID, License.Key);
            return reply.status(500);
        }

        if (License.HWID && request.Fingerprint) {
            if (License.HWID !== request.Fingerprint) {

                const Country = request.headers["cf-ipcountry"];
                const OLD = License.HWID;


                // HWID reset
                License = await Database.UpdateLicense(projectID, key, request.Fingerprint, License.DiscordID, License.ExpireAt);
                try {
                    await WebhookHandler.HWIDReset(Project.Webhook, Project, License, OLD, request.Fingerprint, Country);
                    await WebhookHandler.HWIDReset("", Project, License, OLD, request.Fingerprint, Country);
                } catch (er) {
                    console.log(er);
                }
            }
        }

        if (!License.HWID && request.Fingerprint) {
            License = await Database.UpdateLicense(projectID, key, request.Fingerprint, License.DiscordID, License.ExpireAt);
        }

        if (License.Blacklisted) {
            try {
                await Database.IncrementThreats(Project.id);
                await WebhookHandler.BlacklistedExecution(Project.Webhook, Project);
                await WebhookHandler.BlacklistedExecution("", Project);
            } catch (er) {
                console.log(er);
            }
            return reply.status(500);
        }

        const User = await Database.GetUserEx(Project.APIKey);
        const Storage = User.ServerStorage || {};
        Storage[Project.LoaderConfig._RESPONSE_TOKEN_INDEX] = Project.LoaderConfig._UNIQUETOKEN;

        if (!License.ExpireAt) {
            License.ExpireAt = 0;
        }

        const McInstructions = mcscript(`
            # Check License Key
            
            getlicensekey R0
            loadk R1, "${License.Key}"
            eq R0, R1

            # Crash if not Equal
            jeq 1
            jmp -1

            # Check HWID

            gethwid R0
            loadk R1, "${License.HWID || ""}"
            eq R0, R1

            # Crash if not Equal
            jeq 1
            jmp -1

            # Check Loader Hash
            getresposeindex R0, "${Project.LoaderConfig._RESPONSE_LOADER_HASH}"
            loadk R1, "${Project.LoaderHash}"
            eq R0, R1

            # Crash if not Equal
            jeq 1
            jmp -1
        `, Project.LoaderConfig)

        reply.send(json({
            [Project.LoaderConfig._RESPONSE_VM_BYTECODE]: json(McInstructions, Project.LoaderConfig),
            [Project.LoaderConfig._RESPONSE_TOKEN_INDEX]: Project.LoaderConfig._UNIQUETOKEN,
            
            [Project.LoaderConfig._RESPONSE_INTERINDEX]: Project.LoaderConfig._INTERVALKEY + 12,
            [Project.LoaderConfig._RESPONSE_LOADER_HASH]: Project.LoaderHash,
            [Project.LoaderConfig._RESPONSE_TIMESTAMP]: Math.floor(Date.now() / 1000).toString(),
            [Project.LoaderConfig._RESPONSE_RNG]: token,
            [Project.LoaderConfig._RESPONSE_SECONDARY_RNG]: second_token,
            [Project.LoaderConfig._RESPONSE_THIRD_RNG]: third_token,
            [Project.LoaderConfig._RESPONSE_FOUTH_RNG]: fourth_token,

            [Project.LoaderConfig._RESPONSE_BYTECODE]: "001002003004005006007008009010011000",
            [Project.LoaderConfig._RESPONSE_FINGERPRINT]: request.Fingerprint ? 1 : 0,
            [Project.LoaderConfig._RESPONSE_STORAGE]: json(Storage, Project.LoaderConfig),
            [Project.LoaderConfig._RESPONSE_USERKEY]: License.Key,
            [Project.LoaderConfig._RESPONSE_BLACKLIST_OBJECT]: json({
                [Project.LoaderConfig._RESPONSE_TOKEN_INDEX]: Project.LoaderConfig._UNIQUETOKEN,

                [Project.LoaderConfig._RESPONSE_BLACKLISTED_BOOL]: License.Blacklisted ? 1 : 0,
                [Project.LoaderConfig._RESPONSE_BLACKLISTED_REASON]: License.BlacklistReason || "",
            }, Project.LoaderConfig),
            [Project.LoaderConfig._RESPONSE_USER_OBJECT]: json({
                [Project.LoaderConfig._RESPONSE_TOKEN_INDEX]: Project.LoaderConfig._UNIQUETOKEN,

                a: License.DiscordID || "",
                b: License.HWID || "",
                c: License.Key,
                d: License.ExpireAt ? License.ExpireAt.toString() : License.ExpireAt
            }, Project.LoaderConfig)
        }, Project.LoaderConfig));

        // Saves 0.5ms from the response (was above reply.send, now stops hanging for this)
        if (!License.Blacklisted) {
            try {
                await Database.IncrementExecutions(Project.id, License.Key);
                await WebhookHandler.ScriptExecuted(Project.Webhook, Project, License);
                //await WebhookHandler.ScriptExecuted("", Project, License);
            } catch (er) {
                console.log(er);
            }    
        }
    });

    fastify.get("/headers", { preHandler: Middleman }, (request, reply) => {
        if (!Timing.has(request.Fingerprint)) {
            Timing.set(request.Fingerprint, Date.now());
        }

        reply.send(request.headers);
    });
}

module.exports = routes;