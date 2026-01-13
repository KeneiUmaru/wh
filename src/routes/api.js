const { global_loader_version } = require("../config.json");
const { writeFileSync, readFileSync, existsSync, rmSync } = require("fs");
const database = require("../modules/database");
const codegen = require("../modules/codegen");
const configgen = require("../modules/configgen");
const schemas = require("../modules/schemas");
const webhook = require("../modules/webhook");
const formurlencoded = require("form-urlencoded");
const crypto = require("crypto");
const path = require("path");

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const WebhookHandler = new webhook();
const Database = new database();
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const byteSize = str => new Blob([str]).size;
let Statistics = {};

async function GetStatistics() {
    return new Promise(async (resolve, reject) => {
        const NextResync = new Date();
        NextResync.setHours(NextResync.getHours() + 1);
        
        const ProjectStats = await Database.GetAllProjectStats();
        const RegisteredUsers = await Database.GetUserCount();

        Statistics.Executions = ProjectStats._sum.ExecutionCount;
        Statistics.Users = ProjectStats._sum.UserCount + RegisteredUsers;
        Statistics.Projects = ProjectStats._count;
        Statistics.NextUpdate = NextResync.getTime();
        resolve();
    });
}

/**
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
*/
async function AuthenticationHandler(request, reply) {
    const Authorization = request.headers["authorization"];
    const User = await Database.GetUserEx(Authorization);
    if (!User) {
        return reply.status(401).send({ error: "Invalid Authorization" });
    }

    if (User.SubscriptionEnd) {
        const Time = Date.now()
        console.log(Time, User.SubscriptionEnd.getTime())
        if (Time > User.SubscriptionEnd.getTime()) {
            return reply.status(402).send({ error: "Subscription Expired" });
        }
    }

    request.Authorization = Authorization;
    request.User = User;
}

function isValidTimestamp(timestamp) {
    return timestamp >= 0 && timestamp <= 253402300799;
}

/**
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
*/
async function routes(fastify, options) {	
    fastify.get("/", async (request, reply) => {
        if (!Statistics.NextUpdate || Date.now() >= Statistics.NextUpdate) {
            console.log("Fetched latest statistics");
            await GetStatistics();
        }
        reply.send({ version: 1, executions: Statistics.Executions + 1303860, users: Statistics.Users + 2333, projects: Statistics.Projects + 200 });
    });

    fastify.post("/register", { schema: { headers: schemas.APIKeyHeader, body: schemas.RegLoginSchema } }, async (request, reply) => {
        const { authorization } = request.headers;
        const { Email, Password } = request.body;

        if (!authorization) {
            return reply.status(400).send({ error: "Invalid Captcha (refresh the page)" });
        }
        
        let form = new FormData();
        form.append("response", authorization);
        form.append("secret", process.env.CAPTCHA_SECRET);
        form.append("remoteip", request.IPAddress);

        const packet = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: form
        });

        const body = await packet.json();
        if (!body.success) {
            return reply.status(401).send({ error: "Invalid Captcha (refresh the page)" });
        }

        if (!Email.match(/^\S+@\S+\.\S+$/)) {
            return reply.status(400).send({ error: "Invalid Email" });
        }

        const Existing = await Database.GetUser(Email);
        if (Existing) {
            return reply.status(400).send({ error: "This email is registered to another user" });
        }

        const APIKey = crypto.randomUUID();
        await Database.CreateUser(Email, sha256(Password), APIKey);

        reply.send({ APIKey });
    });

    fastify.post("/login", { schema: { headers: schemas.APIKeyHeader, body: schemas.RegLoginSchema } }, async (request, reply) => {
        const { authorization } = request.headers;
        const { Email, Password } = request.body;

        if (!authorization) {
            return reply.status(400).send({ error: "Invalid Captcha (refresh the page)" });
        }
        
        let form = new FormData();
        form.append("response", authorization);
        form.append("secret", process.env.CAPTCHA_SECRET);
        form.append("remoteip", request.IPAddress);

        const packet = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: form
        });

        const body = await packet.json();
        if (!body.success) {
            return reply.status(401).send({ error: "Invalid Captcha (refresh the page)" });
        }

        if (!Email.match(/^\S+@\S+\.\S+$/)) {
            return reply.status(400).send({ error: "Invalid Email" });
        }
        
        const User = await Database.GetUser(Email);
        if (!User || User?.Password !== sha256(Password)) {
            return reply.status(401).send({ error: "Invalid email or password" });
        }

        reply.send({ APIKey: User.APIKey });
    });


    // Get Info On API Key
    fastify.get("/user/:APIKey", { schema: { params: schemas.GetAPIKeyParamSchema } }, async (request, reply) => {
        const { APIKey } = request.params;

        const User = await Database.GetUserEx(APIKey);
        if (!User) {
            return reply.status(401).send({ error: "Invalid Authorization" });
        }

        const Projects = await Database.GetProjects(APIKey);
        for (let Project of Projects) {
            delete Project.LoaderConfig;
        }
        
        delete User.Password;
        User.Projects = Projects;

        reply.send(User);
    });

    // Update email and password
    fastify.patch("/user/update", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, body: schemas.RegLoginSchema } }, async (request, reply) => {
        const { Email, Password } = request.body;
        const { captcha } = request.headers;

        let form = new FormData();
        form.append("response", captcha);
        form.append("secret", process.env.CAPTCHA_SECRET);
        form.append("remoteip", request.IPAddress);

        const packet = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: form
        });

        const body = await packet.json();
        if (!body.success) {
            return reply.status(401).send({ error: "Invalid Captcha (refresh the page)" });
        }

        if (!Email.match(/^\S+@\S+\.\S+$/)) {
            return reply.status(400).send({ error: "Invalid Email" });
        }
        
        const Existing = await Database.GetUser(Email);
        if (Existing && Existing.id != request.User.id) {
            return reply.status(400).send({ error: "This email is registered to another user" });
        }

        const Result = await Database.UpdateUser(Email, sha256(Password));
        delete Result.Password;
        reply.send(Result);
    });

    fastify.get("/billing/invoices", { schema: { headers: schemas.APIKeyHeader }, preHandler: AuthenticationHandler }, async (request, reply) => {
        const Invoices = await Database.GetUserInvoices(request.User.id);
        return reply.send(Invoices);
    });

    // Regenerate API-Key
    fastify.post("/user/regenerate", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader } }, async (request, reply) => {
        const { captcha } = request.headers;

        let form = new FormData();
        form.append("response", captcha);
        form.append("secret", process.env.CAPTCHA_SECRET);
        form.append("remoteip", request.IPAddress);

        const packet = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: form
        });

        const body = await packet.json();
        if (!body.success) {
            return reply.status(401).send({ error: "Invalid Captcha (refresh the page)" });
        }

        const Existing = request.Authorization;
        const New = crypto.randomUUID();

        let Result;
        try {
            Result = await Database.UpdateAPIKey(Existing, New);
        } catch (er) {
            console.log("MAJOR", er);
            return reply.status(400).send({ error: "Failed to regenerate" });
        }
        
        reply.send(Result);
    });

    // Create Project
    fastify.post("/project/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, body: schemas.CreateProjectSchema } }, async (request, reply) => {
        const { Name, Webhook } = request.body;
        
        if (!Name.match(/^[\w'\-\!\s.\d]+$/)) {
            return reply.status(400).send({ error: "The name contains invalid characters" });
        }

        if (!Webhook.match(/^https:\/\/(canary\.)?discord(app)?.com\/api\/webhooks\/\d+\/[\w\d-]+$/)) {
            return reply.status(400).send({ error: "The webhook url is not valid (must be a valid discord URL)" });
        }

        const Projects = await Database.GetProjects(request.Authorization);
        if (request.User.SubscriptionType == "free" && Projects.length >= 1) {
            return reply.status(402).send({ error: "You need to upgrade your subscription to create more than 1 project" });
        }

        if (request.User.SubscriptionType == "pro" && Projects.length >= 25) {
            return reply.status(402).send({ error: "You need to upgrade your subscription to create more than 25 projects" });
        }

        if (request.User.SubscriptionType == "advanced" && Projects.length >= 100) {
            return reply.status(402).send({ error: "You need to upgrade your subscription to create more than 100 projects" });
        }
        
        let LoaderConfig = configgen();

        let { hash, source } = await codegen(LoaderConfig);
        const Project = await Database.CreateProject(Name, Webhook, request.Authorization, hash, global_loader_version, LoaderConfig);
        source = source.replace(new RegExp(escapeRegExp("PROJECT_ID"), "g"), `"${Project.id}"`);
        source = source.replace(new RegExp(escapeRegExp("PROJECT_NAME"), "g"), `"${Project.Name}"`);
        source = source.replace(new RegExp(escapeRegExp("INTERNAL_REWARD_CONNECTED"), "g"), "false");
        source = source.replace(new RegExp(escapeRegExp("INTERNAL_REWARD_URL"), "g"), "\"\"");
        writeFileSync(path.join(__dirname, `../../loaders/${hash}.lua`), source);

        try {
            await WebhookHandler.ProjectCreated(Webhook, Project.id);
        } catch (er) {
            console.log(er);
        }

        delete Project.LoaderConfig;
        reply.send(Project);
    });

    // Update Project
    fastify.patch("/project/:id/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.GetProjectSchemaParam, body: schemas.CreateProjectSchema } }, async (request, reply) => {
        const { id } = request.params;
        const { Name, Webhook } = request.body;
        
        const Project = await Database.GetProject(id);
        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        if (!Name.match(/^[\w'\-\!\s.\d]+$/)) {
            return reply.status(400).send({ error: "The name contains invalid characters" });
        }

        if (!Webhook.match(/^https:\/\/(canary\.)?discord(app)?.com\/api\/webhooks\/\d+\/[\w\d-]+$/)) {
            return reply.status(400).send({ error: "The webhook url is not valid (must be a valid discord URL)" });
        }

        const Result = await Database.UpdateProject(Project.id, Name, Webhook);
        delete Result.LoaderConfig;
        reply.send(Result);
    });

    // Update Storage Key
    fastify.post("/storage/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, body: schemas.CreateStorageKeySchema } }, async (request, reply) => {
        const { Key, Value } = request.body;

        if (!Key.match(/^[\w'\-\!\s.\d]+$/)) {
            return reply.status(400).send({ error: "The key contains invalid characters" });
        }

        if (request.User.SubscriptionType == "free") {
            return reply.status(402).send({ error: "You need to upgrade your subscription to create a record" });
        }

        const Storage = request.User.ServerStorage || {};
        Storage[Key] = Value;

        const Result = await Database.UpdateServerStorage(request.Authorization, Storage);
        reply.send(Result.ServerStorage);
    });

    fastify.delete("/storage/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, body: schemas.DeleteStorageKeySchema } }, async (request, reply) => {
        const { Key, Value } = request.body;

        if (!Key.match(/^[\w'\-\!\s.\d]+$/)) {
            return reply.status(400).send({ error: "The key contains invalid characters" });
        }

        const Storage = request.User.ServerStorage || {};
        if (!Storage[Key]) {
            return reply.status(400).send({ error: "This storage key doesn't exist" });
        }

        delete Storage[Key];

        const Result = await Database.UpdateServerStorage(request.Authorization, Storage);
        reply.send(Result.ServerStorage);
    })

    // Get Storage
    fastify.get("/storage/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader } }, async (request, reply) => {
        const Storage = request.User.ServerStorage || {};
        reply.send(Storage);
    });

    // Regen Loader
    fastify.post("/project/:id/loader/generate", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.GetProjectSchemaParam, querystring: schemas.LoaderGenerateOptionsSchema } }, async (request, reply) => {
        const { id } = request.params;
        const { keyGUI } = request.query;
        
        let Project = await Database.GetProject(id);
        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        if (Project.LoaderVersion === global_loader_version) {
            if (request.User.SubscriptionType == "free") {
                return reply.status(402).send({ error: "This requires a paid subscription" });
            }    
        }

        let LoaderConfig = configgen();

        let { hash, source, generatedIn } = await codegen(LoaderConfig, keyGUI);
        Project = await Database.UpdateProjectLoaderInfo(Project.id, hash, global_loader_version, LoaderConfig);

        const Reward = await Database.GetReward(Project.id);
        source = source.replace(new RegExp(escapeRegExp("PROJECT_ID"), "g"), `"${Project.id}"`);
        source = source.replace(new RegExp(escapeRegExp("PROJECT_NAME"), "g"), `"${Project.Name}"`);
        source = source.replace(new RegExp(escapeRegExp("INTERNAL_REWARD_CONNECTED"), "g"), Reward ? "true" : "false");
        source = source.replace(new RegExp(escapeRegExp("INTERNAL_REWARD_URL"), "g"), Reward ? `"https://securelua.com/rewards/?id=${Project.id}"` : "\"\"");

        writeFileSync(path.join(__dirname, `../../loaders/${hash}.lua`), source);

        try {
            await WebhookHandler.LoaderGenerated(Project.id, generatedIn, request.User.Email, hash, keyGUI);
        } catch (er) {
            console.log(er);
        }
        
        delete Project.LoaderConfig;
        reply.send(Project);
    });

    // Get Project
    fastify.get("/project/:id", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.GetProjectSchemaParam } }, async (request, reply) => {
        const { id } = request.params;

        const Project = await Database.GetProject(id);
        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        Project.global_loader_version = global_loader_version;

        delete Project.LoaderConfig;
        reply.send(Project);
    });

    // Create License
    fastify.post("/project/:id/licenses", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.GetProjectSchemaParam, body: schemas.CreateLicenseSchema } }, async (request, reply) => {
        let { DiscordID, HWID, Expiry } = request.body;
        const { id } = request.params;

        if (DiscordID && !DiscordID.length) {
            delete DiscordID;
        }

        const Project = await Database.GetProject(id);
        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        if (request.User.SubscriptionType == "free" && Project.UserCount > 15) {
            return reply.status(400).send({ error: "You need to upgrade your subscription to create more than 15 users" });
        }

        
        if (request.User.SubscriptionType == "pro" && Project.UserCount >= 1500) {
            return reply.status(402).send({ error: "You need to upgrade your subscription to create more than 1500 users" });
        }

        if (request.User.SubscriptionType == "advanced" && Project.UserCount >= 20000) {
            return reply.status(402).send({ error: "You need to upgrade your subscription to create more than 20000 users" });
        }

        if (Expiry && !isValidTimestamp(Expiry)) {
            return reply.status(400).send({ error: "Invalid Unix Timestamp (must be seconds)" })
        }

        if (Expiry && Date.now() > (Expiry * 1000)) {
            return reply.status(400).send({ error: "Invalid Unix Timestamp (already expired)" })
        }

        const license = await Database.CreateLicense(Project.id, crypto.randomUUID(), HWID, DiscordID, Expiry);
        reply.send(license);
    });

    fastify.delete("/project/:id/licenses/wipe", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.GetProjectSchemaParam, body: schemas.WipeLicensesSchema } }, async (request, reply) => {
        const { Password, Token } = request.body;
        const { id } = request.params;

        let form = new FormData();
        form.append("response", Token);
        form.append("secret", process.env.CAPTCHA_SECRET);
        form.append("remoteip", request.IPAddress);

        const packet = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: form
        });

        const body = await packet.json();
        if (!body.success) {
            return reply.status(401).send({ error: "Invalid Captcha (refresh the page)" });
        }

        const Project = await Database.GetProject(id);
        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        if (request.User.Password !== sha256(Password)) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const result = await Database.WipeDatabase(Project.id);
        reply.send(result);
    });

    // Get Licenses
    fastify.get("/project/:id/licenses", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.GetProjectSchemaParam } }, async (request, reply) => {
        const { id } = request.params;
        const Project = await Database.GetProject(id);

        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const Licenses = await Database.GetLicenses(id);
        reply.send(Licenses);
    });

    // Get License By License Key

    fastify.get("/project/:id/license/:licenseKey", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.GetLicenseFromLicenseKey } }, async (request, reply) => {
        const { id, licenseKey } = request.params;
        const Project = await Database.GetProject(id);

        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const License = await Database.GetLicense(Project.id, licenseKey);
        if (!License) {
            return reply.status(404).send({ error: "This license does not exist" });
        }
        
        reply.send(License);
    });

    // Get License By Discord ID
    fastify.get("/project/:id/license/discord/:discordID", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.GetLicenseFromDiscordID } }, async (request, reply) => {
        const { id, discordID } = request.params;
        const Project = await Database.GetProject(id);

        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const License = await Database.GetLicenseByDiscordID(Project.id, discordID);
        if (!License) {
            return reply.status(404).send({ error: "This license does not exist" });
        }
        
        reply.send(License);
    });

    // Update License
    fastify.patch("/project/:id/licenses", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.GetProjectSchemaParam, body: schemas.UpdateLicenseSchema } }, async (request, reply) => {
        const { DiscordID, HWID, Expiry, Key } = request.body;
        const { id } = request.params;
        const Project = await Database.GetProject(id);

        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const Existing = await Database.GetLicense(id, Key);
        if (!Existing) {
            return reply.status(400).send({ error: "License doesn't exist" });
        }

        if (Expiry && !isValidTimestamp(Expiry)) {
            return reply.status(400).send({ error: "Invalid Unix Timestamp (must be seconds)" })
        }

        if (Expiry && Date.now() > (Expiry * 1000)) {
            return reply.status(400).send({ error: "Invalid Unix Timestamp (already expired)" })
        }

        const result = await Database.UpdateLicense(id, Key, HWID, DiscordID, Expiry);
        reply.send(result);
    });
    
    // Delete License
    fastify.delete("/project/:id/licenses", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.GetProjectSchemaParam, body: schemas.DeleteLicenseSchema } }, async (request, reply) => {
        const { Key } = request.body;
        const { id } = request.params;
        const Project = await Database.GetProject(id);

        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const Existing = await Database.GetLicense(id, Key);
        if (!Existing) {
            return reply.status(400).send({ error: "License doesn't exist" });
        }

        const result = await Database.DeleteLicense(id, Key);
        reply.send(result);
    });

    // Blacklist License
    fastify.post("/project/:id/licenses/blacklist", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.GetProjectSchemaParam, body: schemas.BlacklistLicenseSchema } }, async (request, reply) => {
        const { Key, Blacklisted, BlacklistReason } = request.body;
        const { id } = request.params;
        const Project = await Database.GetProject(id);

        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const Existing = await Database.GetLicense(id, Key);
        if (!Existing) {
            return reply.status(400).send({ error: "License doesn't exist" });
        }

        const result = await Database.UpdateLicenseBlacklist(id, Key, Blacklisted, BlacklistReason);
        reply.send(result);
    });

    // Generate Licenses
    fastify.post("/project/:id/licenses/generate", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.GetProjectSchemaParam, body: schemas.GenerateLicensesSchema } }, async (request, reply) => {
        const { Amount, Token, Expiry } = request.body;
        const { id } = request.params;
        const Project = await Database.GetProject(id);

        let form = new FormData();
        form.append("response", Token);
        form.append("secret", process.env.CAPTCHA_SECRET);
        form.append("remoteip", request.IPAddress);

        const packet = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: form
        });

        const body = await packet.json();
        if (!body.success) {
            return reply.status(401).send({ error: "Invalid Captcha (refresh the page)" });
        }

        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        if (Expiry && !isValidTimestamp(Expiry)) {
            return reply.status(400).send({ error: "Invalid Unix Timestamp (must be seconds)" })
        }

        if (Expiry && Date.now() > (Expiry * 1000)) {
            return reply.status(400).send({ error: "Invalid Unix Timestamp (already expired)" })
        }

        if (request.User.SubscriptionType == "free") {
            if (Amount + Project.UserCount > 15) {
                return reply.status(402).send({ error: "You need to upgrade your subscription to create more than 15 users" });
            }
        }

        
        if (request.User.SubscriptionType == "pro" && Amount + Project.UserCount > 1500) {
            return reply.status(402).send({ error: "You need to upgrade your subscription to create more than 1500 users" });
        }

        if (request.User.SubscriptionType == "advanced" && Amount + Project.UserCount > 20000) {
            return reply.status(402).send({ error: "You need to upgrade your subscription to create more than 20,000 users" });
        }

        const Data = [];
        const Keys = [];
        for (let i=0; i < Amount; i++) {
            const License = crypto.randomUUID();
            Data.push({
                Key: License,
                ProjectID: Project.id,
                ExpireAt: Expiry
            });
            Keys.push(License);
        }

        await Database.CreateLicenses(Project.id, Data, Amount);

        reply.send(Keys);
    });

    // Get Loader
    fastify.get("/project/:id/loader.lua", { schema: { querystring: schemas.GetLoaderQuerySchema, params: schemas.GetProjectSchemaParam } }, async (request, reply) => {
        const { id } = request.params;
        const { api_key } = request.query;

        const Project = await Database.GetProject(id);
        if (!Project) {
            return reply.status(404).send({ error: "This project does not exist" });
        }

        if (Project.APIKey !== api_key) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        reply.send(readFileSync(path.join(__dirname, `../../loaders/${Project.LoaderHash}.lua`), "utf-8"));
    });

    // Reward Shit

    fastify.post("/reward/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, body: schemas.CreateRewardBodySchema } }, async (request, reply) => {
        const { Name, URLs, Webhook, RewardLength, AssoicatedProject, AntiBypassToken, Publisher } = request.body;

        if (request.User.SubscriptionType == "free") {
            return reply.status(402).send({ error: "You need to upgrade your subscription to create a reward" });
        }

        if (RewardLength < 1 || RewardLength > 72) {
            return reply.status(400).send({ error: "The reward length must be between 1-72 hours" });
        }

        if (!Name.match(/^[\w'\-\!\s.\d]+$/)) {
            return reply.status(400).send({ error: "The reward name contains invalid characters" });
        }

        if (!Webhook.match(/^https:\/\/(canary\.)?discord(app)?.com\/api\/webhooks\/\d+\/[\w\d-]+$/)) {
            return reply.status(400).send({ error: "The webhook url is not valid (must be a valid discord URL)" });
        }

        const Project = await Database.GetProject(AssoicatedProject);
        if (!Project) {
            return reply.status(400).send({ error: "The project doesn't exist" });
        }

        if (Project.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const Existing = await Database.GetReward(Project.id);
        if (Existing) {
            return reply.status(400).send({ error: "You already have a reward linked to this project" });
        }

        if (Publisher !== "Linkvertise" && Publisher !== "LootLabs") {
            return reply.status(400).send({ error: "Invalid Publisher" });
        }

        for (const PassedURL of URLs) {
            try {
                new URL(PassedURL)
            } catch (er) {
                return reply.status(400).send({ error: `Invalid URL: ${PassedURL}` });
            }

            const packet = await fetch("https://proxy.xhspkkecfo.workers.dev/", {
                method: "GET",
                headers: {
                    "url": PassedURL
                }
            });

            const text = await packet.text();
            if (text !== "linkvertise.com" && Publisher === "Linkvertise") {
                return reply.status(400).send({ error: `Invalid URL: ${PassedURL}` });
            } else if (text !== "lootdest.org" && Publisher === "LootLabs") {
                return reply.status(400).send({ error: `Invalid URL: ${PassedURL}` });
            }
        }

        const result = await Database.CreateReward(request.Authorization, AssoicatedProject, Name, URLs, Webhook, AntiBypassToken, RewardLength, Publisher);
        reply.send(result);
    });

    fastify.delete("/reward/:id/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, params: schemas.DeleteRewardSchema } }, async (request, reply) => {
        const { id } = request.params;

        const Reward = await Database.GetReward(id);
        if (!Reward) {
            return reply.status(404).send({ error: "This reward does not exist" });
        }

        if (Reward.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const Result = await Database.DeleteReward(Reward.id);
        reply.send(Result);
    });

    fastify.get("/reward/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader } }, async (request, reply) => {
        const Rewards = await Database.GetUserRewards(request.Authorization);
        reply.send(Rewards);
    });

    // Script Shit 

    fastify.post("/script/", { preHandler: AuthenticationHandler, schema: { body: schemas.CreateScriptSchema } }, async (request, reply) => {
        const { Name, Content, Roblox } = request.body;

        if (request.User.SubscriptionType == "free") {
            return reply.status(402).send({ error: "You need to upgrade your subscription to upload a script" });
        }

        if (!Name.match(/^[\w'\-\!\s.\d]+$/)) {
            return reply.status(400).send({ error: "The name contains invalid characters" });
        }

        if (byteSize(Content) > 2000000) {
            return reply.status(400).send({ error: "This script is too large (must be under 2MB)" });
        }

        const Result = await Database.CreateScript(request.Authorization, Name, Roblox);
        writeFileSync(path.join(__dirname, `../../scripts/${Result.id}.lua`), Content);
        reply.send(Result);
    });

    fastify.get("/script/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader } }, async (request, reply) => {
        const result = await Database.GetUserScripts(request.Authorization);
        reply.send(result);
    });

    fastify.delete("/script/:scriptId/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader } }, async (request, reply) => {
        const { scriptId } = request.params;
        const script = await Database.GetScript(scriptId);

        if (!script) {
            return reply.status(400).send({ error: "This script doesn't exist" });
        }

        if (script.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Invalid Authorization" });
        }

        if (existsSync(path.join(__dirname, `../../scripts/${scriptId}.lua`))) {
            rmSync(path.join(__dirname, `../../scripts/${scriptId}.lua`));
        }

        const result = await Database.DeleteUserScript(scriptId);
        reply.send(result);
    });

    fastify.patch("/script/:scriptId/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, body: schemas.UpdateScriptSchema } }, async (request, reply) => {
        const { scriptId } = request.params;
        const { Content, Roblox, Name } = request.body;
    
        const script = await Database.GetScript(scriptId);
        if (!script) {
            return reply.status(400).send({ error: "This script doesn't exist" });
        }

        if (script.APIKey !== request.Authorization) {
            return reply.status(401).send({ error: "Invalid Authorization" });
        }

        if (byteSize(Content) > 2000000) {
            return reply.status(400).send({ error: "This script is too large (must be under 2MB)" });
        }

        if (existsSync(path.join(__dirname, `../../scripts/${scriptId}.lua`))) {
            rmSync(path.join(__dirname, `../../scripts/${scriptId}.lua`));
        }
        
        await Database.UpdateScript(script.id, Name, Roblox);
        writeFileSync(path.join(__dirname, `../../scripts/${scriptId}.lua`), Content);
        reply.send({ ok: true });
    });

    // Ticket Shit

    // Create Ticket
    fastify.post("/ticket/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, body: schemas.CreateTicketSchema } }, async (request, reply) => {
        const { Message } = request.body;

        if (request.User.SubscriptionType == "free") {
            return reply.status(402).send({ error: "You need to upgrade your subscription to create a ticket" });
        }
        
        const Messages = [
            {
                username: request.User.Email,
                timestamp: Date.now(),
                message: Message
            }
        ]

        const Result = await Database.CreateTicket(request.Authorization, `Ticket #${Math.floor(Math.random() * 99999)}`);
        writeFileSync(path.join(__dirname, `../../tickets/${Result.id}.json`), JSON.stringify(Messages, null, 4));
        reply.send(Result);
    });

    // Get Tickets
    fastify.get("/ticket/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader } }, async (request, reply) => {
        let Result;

        if (request.User.Admin) {
            Result = await Database.GetAllTickets();
        } else {
            Result = await Database.GetUserTickets(request.Authorization);
        }

        reply.send(Result);
    });

    // Send Message
    fastify.post("/ticket/:ticketId/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, body: schemas.CreateTicketSchema } }, async (request, reply) => {
        const { ticketId } = request.params;
        const { Message } = request.body;

        const Ticket = await Database.GetTicket(ticketId);
        if (!Ticket) {
            return reply.status(404).send({ error: "This ticket doesn't exist" });
        }

        if (Ticket.APIKey !== request.Authorization && !request.User.Admin) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        if (Ticket.Status === "Unclaimed" && request.User.Admin) {
            await Database.UpdateTicketStatus(Ticket.id, "Claimed");
        }

        if (Ticket.Status === "Closed" && !request.User.Admin) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const Messages = JSON.parse(readFileSync(path.join(__dirname, `../../tickets/${Ticket.id}.json`), "utf-8"));
        Messages.push({
            username:  request.User.Admin ? "Administrator" : request.User.Email,
            timestamp: Date.now(),
            message: Message
        })
        writeFileSync(path.join(__dirname, `../../tickets/${Ticket.id}.json`), JSON.stringify(Messages, null, 4));
        reply.send(Messages);
    });

    // Close Ticket (Admin Only)
    fastify.post("/ticket/:ticketId/close", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader } }, async (request, reply) => {
        const { ticketId } = request.params;

        const Ticket = await Database.GetTicket(ticketId);
        if (!Ticket) {
            return reply.status(404).send({ error: "This ticket doesn't exist" });
        }

        if (!request.User.Admin) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const Result = await Database.UpdateTicketStatus(Ticket.id, "Closed");
        reply.send(Result);
    });

    // Delete Ticket (Admin Only)
    fastify.delete("/ticket/:ticketId/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader } }, async (request, reply) => {
        const { ticketId } = request.params;

        const Ticket = await Database.GetTicket(ticketId);
        if (!Ticket) {
            return reply.status(404).send({ error: "This ticket doesn't exist" });
        }

        if (!request.User.Admin) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const Result = await Database.DeleteTicket(Ticket.id);
        rmSync(path.join(__dirname, `../../tickets/${Ticket.id}.json`));
        reply.send(Result);
    });

    // Get Specific Ticket
    fastify.get("/ticket/:ticketId/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader } }, async (request, reply) => {
        const { ticketId } = request.params;

        const Ticket = await Database.GetTicket(ticketId);
        if (!Ticket) {
            return reply.status(404).send({ error: "This ticket doesn't exist" });
        }

        if (Ticket.APIKey !== request.Authorization && !request.User.Admin) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        if (!existsSync(path.join(__dirname, `../../tickets/${Ticket.id}.json`))) {
            writeFileSync(path.join(__dirname, `../../tickets/${Ticket.id}.json`), JSON.stringify([], null, 4));
        }
        
        const Messages = JSON.parse(readFileSync(path.join(__dirname, `../../tickets/${Ticket.id}.json`), "utf-8"));
        Ticket.Messages = Messages;
        reply.send(Ticket);
    });

    // Billing Shit

    // Subscription Invoices
    fastify.post("/billing/subscription/invoice", { schema: { headers: schemas.APIKeyHeader, body: schemas.SubscriptionInvoiceCreateSchema }, preHandler: AuthenticationHandler }, async (request, reply) => {
        const { months, plan } = request.body;

        if (plan !== "pro" && plan !== "advanced") {
            return reply.status(402).send({ error: "Failed to create invoice" });
        }

        const ExactPrice = ((plan == "pro" ? 7.45 : 13.45) * months);

        const OrderID = crypto.randomUUID();
        const packet = await fetch("https://api.nowpayments.io/v1/invoice", {
            method: "POST",
            headers: {
                ["x-api-key"]: process.env.CRYPTO_NOW_API_KEY,
                ["content-type"]: "application/json"
            },
            body: JSON.stringify({
                price_amount: ExactPrice,
                price_currency: "usd",
                order_description: `x${months} of SecureLua ${plan == "pro" ? "Pro" : "Advanced"} Plan`,
                order_id: OrderID,
                ipn_callback_url: "https://securelua.com/api/billing/nowpayments/ipn"
            })
        });
        
        if (packet.status !== 200) {
            return reply.status(500).send({ error: "Failed to create invoice" });
        }

        const { invoice_url, id, price_amount } = await packet.json();
        try {
            await Database.SubscriptionCreateCryptoInvoice(OrderID, request.User.id, months, price_amount, plan);
        } catch (er) {
            console.log(er);
            return reply.status(500).send({ error: "Failed to create invoice" });
        }
        
        reply.send({ invoice_url, id });
    });

    fastify.post("/billing/subscription/stripe/checkout", { schema: { headers: schemas.APIKeyHeader, body: schemas.SubscriptionInvoiceCreateSchema }, preHandler: AuthenticationHandler }, async (request, reply) => {
        const { months, plan } = request.body;

        const OrderID = crypto.randomUUID();
        
        const { client_secret } = await stripe.checkout.sessions.create({
            client_reference_id: OrderID,
            mode: "payment",
            //success_url: "https://funnelai.bot",
            return_url: "https://securelua.com",
            ui_mode: "embedded",
            currency: "USD",
            customer_email: request.User.Email,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "SecureLua Subscription",
                            description: `x${months} Months of SecureLua`
                        },
                        unit_amount: (months * 24.99) * 100
                    },
                    quantity: 1
                }
            ]
        });

        try {
            await Database.SubscriptionCreateStripeInvoice(OrderID, request.User.id, months, (months * 24.99).toString(), plan)
        } catch (er) {
            console.log(er);
            return reply.status(500).send({ error: "Failed to create invoice" });
        }

        reply.send({ client_secret });
    });


    // Serial Shit

    /*
    fastify.post("/serials/redeem", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, body: schemas.RedeemSerialSchema } }, async (request, reply) => {
        const { serial, captcha } = request.body;
        
        let form = new FormData();
        form.append("response", captcha);
        form.append("secret", process.env.CAPTCHA_SECRET);
        form.append("remoteip", request.IPAddress);

        const packet = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: form
        });

        const body = await packet.json();
        if (!body.success) {
            return reply.status(401).send({ error: "Invalid Captcha (refresh the page)" });
        }

        const SerialData = await Database.GetSerial(serial);
        if (!SerialData) {
            return reply.status(404).send({ error: "This serial doesn't exist" });
        }

        await Database.DeleteSerial(serial);

        let EndDate = request.User.SubscriptionEnd ? new Date(request.User.SubscriptionEnd) : new Date();
        EndDate.setMonth(EndDate.getMonth() + SerialData.Months);

        const Result = await Database.UpdateUserSubscription(request.User.Email, "paid", EndDate);
        reply.send(Result);
    });

    fastify.post("/serials/", { preHandler: AuthenticationHandler, schema: { headers: schemas.APIKeyHeader, body: schemas.CreateSerialSchema } }, async (request, reply) => {
        const { months } = request.body;
        
        if (!request.User.Admin) {
            return reply.status(401).send({ error: "Authorization required" });
        }

        const Result = await Database.CreateSerial(crypto.randomUUID(), months);
        reply.send(Result);
    });
    */

    function sortObject(obj) {
        return Object.keys(obj).sort().reduce(
            (result, key) => {
            result[key] = (obj[key] && typeof obj[key] === 'object') ? sortObject(obj[key]) : obj[key]
            return result
            },
            {}
        )
    }

    fastify.post("/billing/nowpayments/ipn", { schema: { headers: schemas.IPNPaymentHeader } }, async (request, reply) => {
        const hmac = crypto.createHmac('sha512', process.env.CRYPTO_IPN);
        hmac.update(JSON.stringify(sortObject(request.body)));
        const signature = hmac.digest('hex');

        if (request.headers["x-nowpayments-sig"] !== signature) {
            return reply.status(401).send({ error: "Invalid Signature" });
        }

        console.log(request.body);
        const { order_id, payment_status } = request.body;
        const invoice = await Database.GetInvoice(order_id);
        if (!invoice) {
            return reply.status(401).send({ error: "Invalid Order-ID" });
        }

        if (payment_status !== "finished") {
            return reply.send({ success: true });
        }

        const User = await Database.GetUserFromID(invoice.OwnerID);

        let StartDate = User.SubscriptionEnd ? new Date(User.SubscriptionEnd) : new Date();
        let EndDate = new Date(Date.UTC(
            StartDate.getUTCFullYear(),
            StartDate.getUTCMonth() + Invoice.Months,
            StartDate.getUTCDate(),
            StartDate.getUTCHours(),
            StartDate.getUTCMinutes(),
            StartDate.getUTCSeconds(),
            StartDate.getUTCMilliseconds()
        ));

        await Database.UpdateSubscriptionAndInvoiceSuccess(invoice.OwnerID, order_id, EndDate);
        return reply.send({ success: true });
    });
}

module.exports = routes;