const database = require("../modules/database");
const schemas = require("../modules/schemas");
const WebhookHandler = require("../modules/webhook");

const Webhooks = new WebhookHandler();
const sessions = new Map();
const Database = new database();
const VirtualTokens = new Set();

/**
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
*/
async function routes(fastify, options) {
    fastify.get("/", { schema: { querystring: schemas.RewardRedeemQuerySchema } }, async (request, reply) => {
        const { id, hash } = request.query;
        const Reward = await Database.GetReward(id); // PROJECT ID
        if (!Reward) {
            return reply.redirect("/");
        }

        const session = sessions.get(request.IPAddress);
        if (!session) {
            sessions.set(request.IPAddress, { nextLink: 1, id });

            let FirstURL = Reward.URLs[0];

            // precompute urls
            if (Reward.Publisher === "LootLabs") {
                const Token = crypto.randomUUID();
                VirtualTokens.add(Token);

                const DestinationURL = `https://securelua.com/rewards/?id=${id}&hash=${Token}`;
                const packet = await fetch(`https://be.lootlabs.gg/api/lootlabs/url_encryptor?destination_url=${encodeURIComponent(DestinationURL)}&api_token=${Reward.AntiBypassToken}`);
                if (packet.status !== 200) {
                    return reply.send({ error: "LootLabs Failure" });
                }

                const { message } = await packet.json();
                FirstURL = `${FirstURL}&data=${message}`;
            }

            return reply.redirect(FirstURL);
        }

        if (session.id !== id) {
            sessions.delete(request.IPAddress);
            return reply.redirect(request.url);
        }

        if (session.completed) {
            return reply.view("rewards/index.ejs", {
                license: session.license,
                expiry: session.expire.toString()
            });
        }

        if (!hash && session) {
            sessions.delete(request.IPAddress);
            return reply.redirect("/");
        }

        switch (Reward.Publisher) {
            case "Linkvertise": {
                try {
                    const packet = await fetch(`https://publisher.linkvertise.com/api/v1/anti_bypassing?token=${Reward.AntiBypassToken}&hash=${hash}`);
                    const response = await packet.json();
                    if (response.status === false) {
                        sessions.delete(request.IPAddress);
                        await Webhooks.RewardFail(Reward.Webhook, Reward.Name);
                        await Database.IncrementRewardBypasses(Reward.ConnectedProject);
                        return reply.redirect("/");
                    }
                } catch (er) {
                    console.log(er);
                }
                break;
            }
            case "LootLabs": {
                if (!VirtualTokens.has(hash)) {
                    sessions.delete(request.IPAddress);
                    await Webhooks.RewardFail(Reward.Webhook, Reward.Name);
                    await Database.IncrementRewardBypasses(Reward.ConnectedProject);
                    return reply.redirect("/");
                }

                VirtualTokens.delete(hash);
                break;
            }
        }

        if (session.nextLink < Reward.URLs.length) {
            let link = Reward.URLs[session.nextLink];
            sessions.set(request.IPAddress, { nextLink: session.nextLink + 1, id });

            if (Reward.Publisher == "LootLabs") {
                const Token = crypto.randomUUID();
                VirtualTokens.add(Token);

                const DestinationURL = `https://securelua.com/rewards/?id=${id}&hash=${Token}`;
                const packet = await fetch(`https://be.lootlabs.gg/api/lootlabs/url_encryptor?destination_url=${encodeURIComponent(DestinationURL)}&api_token=${Reward.AntiBypassToken}`);
                if (packet.status !== 200) {
                    return reply.send({ error: "LootLabs Failure" });
                }

                const { message } = await packet.json();
                link = `${link}&data=${message}`;
            }

            return reply.redirect(link);
        }

        const License = crypto.randomUUID();
        const ExpireDate = new Date();
        ExpireDate.setHours(ExpireDate.getHours() + Reward.RewardLength);

        sessions.set(request.IPAddress, {
            completed: true,
            license: License,
            expire: ExpireDate.getTime(),
            id
        });

        await Webhooks.RewardCompleted(Reward.Webhook, Reward.Name, Math.floor(ExpireDate.getTime() / 1000), License);
        await Database.CreateLicense(Reward.ConnectedProject, License, undefined, undefined, Math.floor(ExpireDate.getTime() / 1000));
        await Database.IncrementRewardUses(Reward.ConnectedProject);

        return reply.view("rewards/index.ejs", {
            license: License,
            expiry: ExpireDate.getTime().toString()
        });
    });
}

module.exports = routes;