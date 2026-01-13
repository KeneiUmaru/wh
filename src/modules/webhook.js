/**
 * @typedef { import("@prisma/client").User } User
 * @typedef { import("@prisma/client").Project } Project
 * @typedef { import("@prisma/client").License } License
 * @typedef { import("@prisma/client").Reward } Reward
*/

const CRYPTO_PAYMENT_TYPES = [
    "Pending",
    "Paid",
    "Underpaid",
    "Over Paid",
    "Expired",
    "Cancelled"
]

class EmbedBuilder {
    constructor() {
        this.embed = {};

        this.data = {
            content: null,
            username: "Secure Lua",
            avatar_url: "https://res.cloudinary.com/dlxrsqy04/image/upload/f_auto,q_auto/mwgwjgjq0hhhy3nsobhc",
            attachments: []
        }
    }

    setTitle(title) {
        this.embed.title = title;
        return this;
    }

    setColor(color) {
        this.embed.color = color;
        return this;
    }

    setFields(...fields) {
        this.embed.fields = fields;
        return this;
    }

    setAuthor(name, icon_url) {
        this.embed.author = { name, icon_url };
        return this;
    }

    setDescription(text) {
        this.embed.description = text;
        return this;
    }

    setContent(text) {
        this.data.content = text;
        return this;
    }

    toJSON() {
        this.data.embeds = [this.embed];
        return JSON.stringify(this.data);
    }
}

module.exports = class WebhookHandler {
    /**
     * @param {string} Webhook The webhook
     * @param {Project} Project
     * @param {License} License
     * @returns {Promise<null>}
    */
    async ScriptExecuted(Webhook, Project, License) {
        return new Promise(async (resolve, reject) => {
            const Embed = new EmbedBuilder()
                .setTitle("Your script has been executed")
                .setDescription(`Project Executions: **${Project.ExecutionCount + 1}** ↑ \nProject Threats: **${Project.ThreatCount}**`)
                .setFields(
                    {
                        name: "License Key",
                        value: `\`\`\`\n${License.Key}\n\`\`\``
                    },
                    {
                        name: "User Information",
                        value: `Executions: **${License.Executions + 1}** ↑\nHWID Linked: ${License.HWID ? "✓" : "X"}\nDiscord ID: **${License.DiscordID ? License.DiscordID : "Not Set"}**`
                    },
                    {
                        name: "Actions",
                        value: `[View Project](https://securelua.com/dashboard/projects/${Project.id}/)`
                    }
                )
                .setAuthor("Script Executed", "https://res.cloudinary.com/dlxrsqy04/image/upload/f_auto,q_auto/mwgwjgjq0hhhy3nsobhc")
                .setColor(7992702);

            if (!Webhook.length) {
                Webhook = process.env.EXECUTION_GLOBAL_WEBHOOK;
            }

            try {
                await fetch(Webhook, {
                    method: "POST",
                    headers: {
                        ["content-type"]: "application/json"
                    },
                    body: Embed.toJSON()
                });
                resolve();
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} Webhook The webhook
     * @param {Project} Project
     * @param {License} License
     * @returns {Promise<null>}
    */
    async HWIDReset(Webhook, Project, License, OLD, NEW, Country) {
        return new Promise(async (resolve, reject) => {
            const Embed = new EmbedBuilder()
                .setTitle("A user has reset their HWID")
                .setColor(15489620)
                .setDescription(`Project Executions: **${Project.ExecutionCount + 1}** ↑ \nProject Threats: **${Project.ThreatCount}**`)
                .setFields(
                    {
                        name: "Country",
                        value: `**${Country}**`
                    },
                    {
                        name: "License Key",
                        value: `\`\`\`\n${License.Key}\n\`\`\``
                    },
                    {
                        name: "Old HWID",
                        value: `\`\`\`${OLD}\`\`\``
                    },
                    {
                        name: "New HWID",
                        value: `\`\`\`${NEW}\`\`\``
                    },
                    {
                        name: "User Information",
                        value: `HWID Linked: ${License.HWID ? "✓" : "X"}\nDiscord ID: **${License.DiscordID ? License.DiscordID : "Not Set"}**`
                    },
                    {
                        name: "Actions",
                        value: `[View Project](https://securelua.com/dashboard/projects/${Project.id}/)`
                    }
                )
                .setAuthor("HWID Reset", "https://res.cloudinary.com/dlxrsqy04/image/upload/f_auto,q_auto/mwgwjgjq0hhhy3nsobhc");

            if (!Webhook.length) {
                Webhook = process.env.EXECUTION_GLOBAL_WEBHOOK;
            }

            try {
                await fetch(Webhook, {
                    method: "POST",
                    headers: {
                        ["content-type"]: "application/json"
                    },
                    body: Embed.toJSON()
                })
                resolve();
            } catch (er) {
                resolve();
                console.log(er);
            }
        });
    }

    /**
     * @param {string} Webhook The webhook
     * @param {Project} Project
     * @param {License} License
     * @returns {Promise<null>}
    */
    async SystemBlacklist(Webhook, Project, License, Data) {
        return new Promise(async (resolve, reject) => {
            const Embed = new EmbedBuilder()
                .setTitle("The system has blacklisted a suspicous user")
                .setColor(15489620)
                .setFields(
                    {
                        name: "License Key",
                        value: `\`\`\`\n${License.Key}\n\`\`\``
                    },
                    {
                        name: "User Information",
                        value: `HWID Linked: ${License.HWID ? "✓" : "X"}\nDiscord ID: **${License.DiscordID ? License.DiscordID : "Not Set"}**`
                    },
                    {
                        name: "Debug Information",
                        value: `-# If you believe this blacklist is a mistake, send this to support.\n\`\`\`${Data}\`\`\``
                    },
                    {
                        name: "Actions",
                        value: `[View Project](https://securelua.com/dashboard/projects/${Project.id}/)`
                    }
                )
                .setAuthor("Automatic Blacklist", "https://res.cloudinary.com/dlxrsqy04/image/upload/f_auto,q_auto/mwgwjgjq0hhhy3nsobhc")
                .setContent("@everyone");

            if (!Webhook.length) {
                Webhook = process.env.EXECUTION_GLOBAL_WEBHOOK;
            }

            try {
                await fetch(Webhook, {
                    method: "POST",
                    headers: {
                        ["content-type"]: "application/json"
                    },
                    body: Embed.toJSON()
                })
                resolve();
            } catch (er) {
                resolve();
                console.log(er);
            }
        });
    }

    /**
     * @param {string} Webhook The webhook
     * @param {Project} Project
     * @returns {Promise<null>}
    */
    async BlacklistedExecution(Webhook, Project) {
        return new Promise(async (resolve, reject) => {
            const Embed = new EmbedBuilder()
                .setTitle("Blacklisted user attempted to execute")
                .setDescription(`Project Executions: **${Project.ExecutionCount}** \nProject Threats: **${Project.ThreatCount + 1}** ↑`)
                .setColor(15489620)
                .setAuthor("Threat Detected", "https://res.cloudinary.com/dlxrsqy04/image/upload/f_auto,q_auto/mwgwjgjq0hhhy3nsobhc")
                .setFields(
                    {
                        name: "Actions",
                        value: `[View Project](https://securelua.com/dashboard/projects/${Project.id}/)`
                    }
                );

            if (!Webhook.length) {
                Webhook = process.env.EXECUTION_GLOBAL_WEBHOOK;
            }

            try {
                await fetch(Webhook, {
                    method: "POST",
                    headers: {
                        ["content-type"]: "application/json"
                    },
                    body: Embed.toJSON()
                });
                resolve();
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }
    
    /**
     * @param {string} Webhook The webhook
     * @param {Project} Project
     * @returns {Promise<null>}
    */
    async NoKeyExecution(Webhook, Project) {
        return new Promise(async (resolve, reject) => {
            const Embed = new EmbedBuilder()
                .setTitle("User provided an Invalid Key")
                .setDescription(`Project Executions: **${Project.ExecutionCount}** \nProject Threats: **${Project.ThreatCount + 1}** ↑`)
                .setColor(15489620)
                .setFields(
                    {
                        name: "Actions",
                        value: `[View Project](https://securelua.com/dashboard/projects/${Project.id}/)`
                    }
                )
                .setAuthor("Threat Detected", "https://res.cloudinary.com/dlxrsqy04/image/upload/f_auto,q_auto/mwgwjgjq0hhhy3nsobhc");

            if (!Webhook.length) {
                Webhook = process.env.EXECUTION_GLOBAL_WEBHOOK;
            }

            try {
                await fetch(Webhook, {
                    method: "POST",
                    headers: {
                        ["content-type"]: "application/json"
                    },
                    body: Embed.toJSON()
                });
                resolve();
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }
        
    /**
     * @param {string} Webhook The webhook
     * @param {string} ProjectID The Project ID
     * @returns {Promise<null>}
    */
    async ProjectCreated(Webhook, ProjectID) {
        return new Promise(async (resolve, reject) => {
            const Embed = new EmbedBuilder()
                .setDescription("Your project was created successfully")
                .setColor(9121180)
                .setFields(
                    {
                        name: "Actions",
                        value: `[View Project](https://securelua.com/dashboard/projects/${ProjectID}/)`
                    }
                )
                .setAuthor("Secure Lua", "https://res.cloudinary.com/dlxrsqy04/image/upload/f_auto,q_auto/mwgwjgjq0hhhy3nsobhc");

            if (!Webhook.length) {
                Webhook = process.env.PROJECT_CREATE_GLOBAL_WEBHOOK;
            }

            try {
                await fetch(Webhook, {
                    method: "POST",
                    headers: {
                        ["content-type"]: "application/json"
                    },
                    body: Embed.toJSON()
                });
                resolve();
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} ProjectID The Project ID
     * @param {number} Duration Duration
     * @param {string} Email Email Address
     * @param {string} LoaderHash Loader Hash
     * @returns {Promise<null>}
    */
    async LoaderGenerated(ProjectID, Duration, Email, LoaderHash, KeyGUI) {
        return new Promise(async (resolve, reject) => {
            const Embed = new EmbedBuilder()
                .setDescription("A loader was successfully generated")
                .setColor(9557500)
                .setFields(
                    {
                        name: "Created In",
                        value: `**${Duration.toLocaleString()}ms**`,
                        inline: true
                    },
                    {
                        name: "User Email",
                        value: Email,
                        inline: true
                    },
                    {
                        name: "Project ID",
                        value: ProjectID
                    },
                    {
                        name: "Loader Hash",
                        value: LoaderHash
                    },
                    {
                        name: "Include GUI?",
                        value: KeyGUI ? "✓" : "X"
                    }
                )
                .setAuthor("Loader Generated", "https://res.cloudinary.com/dlxrsqy04/image/upload/f_auto,q_auto/mwgwjgjq0hhhy3nsobhc");

            try {
                await fetch(process.env.LOADER_GENERATE_GLOBAL_WEBHOOK, {
                    method: "POST",
                    headers: {
                        ["content-type"]: "application/json"
                    },
                    body: Embed.toJSON()
                });
                resolve();
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {number} PaymentType The Project ID
     * @param {string} Email Email Address
     * @returns {Promise<null>}
    */
    async PaymentNotification(PaymentType, Email) {
        return new Promise(async (resolve, reject) => {
            const type = CRYPTO_PAYMENT_TYPES[PaymentType] || "Unknown";
            const Embed = new EmbedBuilder()
                .setDescription("A invoice has been created")
                .setColor(9557500)
                .setFields(
                    {
                        name: "Payment Status",
                        value: type
                    },
                    {
                        name: "User Email",
                        value: `\`\`\`${Email}\`\`\``
                    }
                )
                .setAuthor("Payment Invoice", "https://res.cloudinary.com/dlxrsqy04/image/upload/f_auto,q_auto/mwgwjgjq0hhhy3nsobhc");

            try {
                await fetch(process.env.PAYMENT_GLOBAL_DISCORD_WEBHOOK, {
                    method: "POST",
                    headers: {
                        ["content-type"]: "application/json"
                    },
                    body: Embed.toJSON()
                });
                resolve();
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} Webhook The webhook
     * @param {string} Name Reward Name
     * @param {number} Expires Expiry Date in ms
     * @param {string} LicenseKey Awarded License
     * @returns {Promise<null>}
    */
    async RewardCompleted(Webhook, Name, Expires, LicenseKey) {
        return new Promise(async (resolve, reject) => {
            const Embed = new EmbedBuilder()
                .setTitle("A user has completed your reward")
                .setColor(16612157)
                .setFields(
                    {
                        name: "Reward",
                        value: `**\"${Name}\"**`,
                        inline: true
                    },
                    {
                        name: "Expires",
                        value: `<t:${Expires}>`,
                        inline: true
                    },
                    {
                        name: "License Key",
                        value: `\`\`\`${LicenseKey}\`\`\``
                    },
                    {
                        name: "Actions",
                        value: "[View Rewards](https://securelua.com/dashboard/rewards)"
                    }
                )
                .setAuthor("Reward Redeemed", "https://res.cloudinary.com/dlxrsqy04/image/upload/f_auto,q_auto/mwgwjgjq0hhhy3nsobhc");

            try {
                const packet = await fetch(Webhook, {
                    method: "POST",
                    headers: {
                        ["content-type"]: "application/json"
                    },
                    body: Embed.toJSON()
                });
                resolve();
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} Webhook The webhook
     * @param {string} Name Reward Name
     * @returns {Promise<null>}
    */
    async RewardFail(Webhook, Name) {
        return new Promise(async (resolve, reject) => {
            const Embed = new EmbedBuilder()
                .setTitle("A user has tried to bypass your reward")
                .setColor(16596285)
                .setFields(
                    {
                        name: "Reward",
                        value: `**\"${Name}\"**`
                    },
                    {
                        name: "Actions",
                        value: "[View Rewards](https://securelua.com/dashboard/rewards)"
                    }
                )
                .setAuthor("Bypass Detected", "https://res.cloudinary.com/dlxrsqy04/image/upload/f_auto,q_auto/mwgwjgjq0hhhy3nsobhc");

            try {
                await fetch(Webhook, {
                    method: "POST",
                    headers: {
                        ["content-type"]: "application/json"
                    },
                    body: Embed.toJSON()
                });
                resolve();
            } catch (er) {
                console.log(er);
                resolve();
            }
        })
    }

    /**
     * @param {string} Webhook The webhook
     * @param {string} Headers Stringified JSON Headers
     * @returns {Promise<null>}
    */
    async RequestFail(Headers) {
        return new Promise(async (resolve, reject) => {
            const Embed = new EmbedBuilder()
                .setTitle("A user failed to request to auth endpoint")
                .setColor(16596285)
                .setFields(
                    {
                        name: "Headers",
                        value: `\`\`\`${Headers}\`\`\``,
                        inline: true
                    }
                )
                .setAuthor("Request Failed", "https://res.cloudinary.com/dlxrsqy04/image/upload/f_auto,q_auto/mwgwjgjq0hhhy3nsobhc")

            try {
                await fetch(process.env.REQUEST_FAIL_DISCORD_WEBHOOK, {
                    method: "POST",
                    headers: {
                        ["content-type"]: "application/json"
                    },
                    body: Embed.toJSON()
                });
                resolve();
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }
}