/**
 * @typedef { import("@prisma/client").User } User
 * @typedef { import("@prisma/client").Project } Project
 * @typedef { import("@prisma/client").License } License
 * @typedef { import("@prisma/client").Reward } Reward
 * @typedef { import("@prisma/client").Script } Script
 * @typedef { import("@prisma/client").Ticket } Ticket
 * @typedef { import("@prisma/client").Serial } Serial
*/

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Database {
    /**
     * @param {string} Email Email address
     * @param {string} Password Hashed password
     * @param {string} APIKey Randomly generated API-Key
     * @returns {Promise<User>}
    */
    async CreateUser(Email, Password, APIKey) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.user.create({ data: { Email, Password, APIKey } })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }
    
    /**
     * @param {string} Email Email address
     * @param {string} Password Hashed password
     * @returns {Promise<User>}
    */
    async UpdateUser(Email, Password) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.user.update({
                    where: { Email },
                    data: { Email, Password }
                })
                resolve(result);
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} OrderID Order ID
     * @returns {Promise<Invoice>}
    */
    async GetInvoice(OrderID) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.invoice.findUnique({
                    where: { OrderID }
                });
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} UserID Order ID
     * @returns {Promise<Invoice>}
    */
    async GetUserInvoices(OwnerID) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.invoice.findMany({
                    where: { OwnerID },
                    orderBy: [
                        {
                            Created: "desc"
                        }
                    ]
                });
                resolve(result);
            } catch (er) {
                console.log(er);
            }
        });
    }

    /**
     * @param {string} Email Email address
     * @returns {Promise<User>}
    */
    async GetUser(Email) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.user.findUnique({ where: { Email } })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} APIKey Existing API-Key
     * @param {string} Name Ticket Name
     * @returns {Promise<Ticket>}
    */
    async CreateTicket(APIKey, Name) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.ticket.create({
                    data: { APIKey, Name }
                });
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} id Ticket ID
     * @returns {Promise<Ticket>}
    */
    async GetTicket(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.ticket.findUnique({
                    where: { id }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} id Ticket ID
     * @param {string} Status Ticket Status
     * @returns {Promise<Ticket>}
    */
    async UpdateTicketStatus(id, Status) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.ticket.update({
                    where: { id },
                    data: {
                        Status
                    }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} id Ticket ID
     * @returns {Promise<Ticket>}
    */
    async DeleteTicket(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.ticket.delete({
                    where: { id }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} APIKey Existing API-Key
     * @returns {Promise<Array<Ticket>>}
    */
    async GetUserTickets(APIKey) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.ticket.findMany({
                    where: { APIKey }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @returns {Promise<Array<Ticket>>}
    */
    async GetAllTickets() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.ticket.findMany();
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} APIKey Existing API-Key
     * @param {string} New New API-Key
     * @returns {Promise<User>}
    */
    async UpdateAPIKey(APIKey, New) {
        return new Promise(async (resolve, reject) => {
            try {
                await prisma.$transaction(async (tx) => {
                    const User = await tx.user.update({
                        where: { APIKey },
                        data: {
                            APIKey: New
                        }
                    });

                    await tx.project.updateMany({
                        where: { APIKey },
                        data: {
                            APIKey: New
                        }
                    });

                    await tx.reward.updateMany({
                        where: { APIKey },
                        data: {
                            APIKey: New
                        }
                    });

                    await tx.script.updateMany({
                        where: { APIKey },
                        data: {
                            APIKey: New
                        }
                    });

                    await tx.ticket.updateMany({
                        where: { APIKey },
                        data: {
                            APIKey: New
                        }
                    });

                    resolve(User);
                });
            } catch (er) {
                console.log(er);
                reject(er);
            }
        });
    }

    /**
     * @param {string} APIKey API Key
     * @returns {Promise<User>}
    */
    async GetUserEx(APIKey) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.user.findUnique({ where: { APIKey } });
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} Name Project name
     * @param {string} Webhook Alert webhook
     * @param {string} APIKey Owner API Key
     * @param {string} LoaderHash Loader Hash
     * @param {string} LoaderVersion Loader Version
     * @param {Object} LoaderConfig Loader Config
     * @returns {Promise<Project>}
    */
    async CreateProject(Name, Webhook, APIKey, LoaderHash, LoaderVersion, LoaderConfig) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.project.create({
                    data: {
                        Name,
                        Webhook,
                        APIKey,
                        LoaderHash,
                        LoaderVersion,
                        LoaderConfig
                    }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} id Project ID
     * @param {string} Name Project name
     * @param {string} Webhook Alert webhook
     * @returns {Promise<Project>}
    */
    async UpdateProject(id, Name, Webhook) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.project.update({
                    where: { id },
                    data: { Name, Webhook }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} ID Associated Project ID
     * @param {string} LoaderHash Loader Hash
     * @param {Object} LoaderVersion Loader Version
     * @param {Object} LoaderConfig Loader Config
     * @returns {Promise<Project>}
    */
    async UpdateProjectLoaderInfo(ID, LoaderHash, LoaderVersion, LoaderConfig) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.project.update({
                    where: { id: ID },
                    data: {
                        LoaderHash,
                        LoaderConfig,
                        LoaderVersion,
                        LoaderCreated: new Date()
                    }
                });
                resolve(result);
            } catch (er) {
                console.log(er);
            }
        });
    }

    /**
     * @param {string} APIKey API Key
     * @param {Object} ServerStorage Storage
     * @returns {Promise<Project>}
    */
    async UpdateServerStorage(APIKey, ServerStorage) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.user.update({
                    where: { APIKey },
                    data: {
                        ServerStorage
                    }
                });
                resolve(result);
            } catch (er) {
                console.log(er);
            }
        });
    }

    /**
     * @param {string} ID Associated Project ID
     * @returns {Promise<Project>}
    */
    async GetProject(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.project.findUnique({
                    where: {
                        id
                    }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} APIKey From API Key
     * @returns {Promise<Project>}
    */
    async GetProjects(APIKey) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.project.findMany({
                    where: {
                        APIKey
                    }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} ProjectID Associated Project ID
     * @param {string} Key License Key
     * @param {string} HWID HWID
     * @param {string} DiscordID Discord ID
     * @param {number} ExpireAt UNIX Expiry (seconds no * 1000)
     * @returns {Promise<License>}
    */
    async CreateLicense(ProjectID, Key, HWID, DiscordID, ExpireAt) {
        return new Promise(async (resolve, reject) => {
            try {
                await prisma.$transaction(async (tx) => {
                    await tx.project.update({
                        where: { id: ProjectID },
                        data: {
                            UserCount: {
                                increment: 1
                            }
                        }
                    });

                    const result = await tx.license.create({
                        data: {
                            ProjectID,
                            Key,
                            HWID,
                            DiscordID,
                            ExpireAt
                        }
                    })

                    resolve(result);
                });
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} ProjectID Associated Project ID
     * @param {string} Data Data to insert into the Database
     * @param {number} Amount Amount of entries to create
     * @returns {Promise<License>}
    */
    async CreateLicenses(ProjectID, Data, Amount) {
        return new Promise(async (resolve, reject) => {
            try {
                await prisma.$transaction(async (tx) => {
                    await tx.project.update({
                        where: { id: ProjectID },
                        data: {
                            UserCount: {
                                increment: Amount
                            }
                        }
                    });

                    const result = await tx.license.createMany({
                        data: Data
                    })

                    resolve(result);
                });
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} ProjectID Associated Project ID
     * @returns {Promise<License>}
    */
    async GetLicenses(ProjectID) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.license.findMany({
                    where: { ProjectID }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} ProjectID Associated Project ID
     * @param {string} Key License Key
     * @returns {Promise<License>}
    */
    async GetLicense(ProjectID, Key) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.license.findUnique({
                    where: { ProjectID, Key }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} ProjectID Associated Project ID
     * @param {string} DiscordID License Key
     * @returns {Promise<License>}
    */
    async GetLicenseByDiscordID(ProjectID, DiscordID) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.license.findFirst({
                    where: { ProjectID, DiscordID }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} ProjectID Associated Project ID
     * @param {string} Key License Key
     * @param {string} HWID HWID
     * @param {string} DiscordID Discord ID
     * @param {number} ExpireAt UNIX Expiry (in seconds (/ 1000))
     * @returns {Promise<License>}
    */
    async UpdateLicense(ProjectID, Key, HWID, DiscordID, ExpireAt) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.license.update({
                    where: { ProjectID, Key },
                    data: {
                        HWID,
                        DiscordID,
                        ExpireAt
                    }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} ProjectID Associated Project ID
     * @param {string} Key License Key
     * @param {boolean} Blacklisted Blacklisted
     * @param {string | null} BlacklistReason Blacklist Reason
     * @returns {Promise<License>}
    */
    async UpdateLicenseBlacklist(ProjectID, Key, Blacklisted, BlacklistReason) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.license.update({
                    where: { ProjectID, Key },
                    data: {
                        Blacklisted,
                        BlacklistReason
                    }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} ProjectID Associated Project ID
     * @param {string} Key License Key
     * @returns {Promise<License>}
    */
    async DeleteLicense(ProjectID, Key) {
        return new Promise(async (resolve, reject) => {
            try {
                await prisma.$transaction(async (tx) => {
                    await tx.project.update({
                        where: { id: ProjectID },
                        data: {
                            UserCount: {
                                increment: -1
                            }
                        }
                    });

                    const result = await prisma.license.delete({
                        where: { ProjectID, Key }
                    });

                    resolve(result);
                });
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} Email Email Address
     * @param {string} Type 'free' or 'paid'
     * @param {number} Expiry 
     * @returns {Promise<User>}
    */
    async UpdateUserSubscription(Email, Type, Expiry) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.user.update({
                    where: { Email },
                    data: {
                        SubscriptionType: Type,
                        SubscriptionCreated: new Date(),
                        SubscriptionEnd: Expiry
                    }
                })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} ProjectID Associated Project ID
     * @param {string} License Key License Key
     * @returns {Promise<License>}
    */
    async IncrementExecutions(ProjectID, LicenseKey) {
        return new Promise(async (resolve, reject) => {
            try {
                await prisma.$transaction(async (tx) => {
                    await tx.project.update({
                        where: { id: ProjectID },
                        data: {
                            ExecutionCount: {
                                increment: 1
                            }
                        }
                    });

                    const result = await tx.license.update({
                        where: { Key: LicenseKey },
                        data: {
                            Executions: {
                                increment: 1
                            }
                        }
                    })

                    resolve(result);
                });
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * @param {string} ProjectID Associated Project ID
     * @returns {Promise<Project>}
    */
    async IncrementThreats(ProjectID) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.project.update({
                    where: { id: ProjectID },
                    data: {
                        ThreatCount: {
                            increment: 1
                        }
                    }
                })
                resolve(result)
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} APIKey API Key
     * @param {string} Name Script Name
     * @returns {Promise<Script>}
    */
    async CreateScript(APIKey, Name, Roblox) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.script.create({
                    data: {
                        Name,
                        APIKey,
                        Roblox
                    }
                });
                resolve(result);
            } catch (er) {
                console.log(er)
                resolve();
            }
        });
    }

    /**
     * @param {string} APIKey API Key
     * @param {string} Name Script Name
     * @returns {Promise<Script>}
    */
    async UpdateScript(ID, Name, Roblox) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.script.update({
                    where: { id: ID },
                    data: {
                        Name,
                        Roblox
                    }
                });
                resolve(result);
            } catch (er) {
                console.log(er)
                resolve();
            }
        });
    }

    /**
     * @param {string} id Script ID
     * @returns {Promise<Script>}
    */
    async GetScript(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.script.findUnique({
                    where: { id }
                });
                resolve(result);
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} id Script ID
     * @returns {Promise<Script>}
    */
    async IncrementScriptDownloads(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.script.update({
                    where: { id },
                    data: {
                        Downloads: {
                            increment: 1
                        }
                    }
                });
                resolve(result);
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} id Script ID
     * @returns {Promise<Script>}
    */
    async DeleteUserScript(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.script.delete({
                    where: { id }
                });
                resolve(result);
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} APIKey API Key
     * @returns {Promise<Array<Script>>}
    */
    async GetUserScripts(APIKey) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.script.findMany({
                    where: { APIKey }
                });
                resolve(result);
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} APIKey API Key
     * @param {string} ConnectedProject Associated Project ID
     * @param {string} Name Reward Name
     * @param {string[]} URLs Array of URLs
     * @param {string} Webhook Webhook String
     * @param {string} AntiBypassToken Bypass Token
     * @param {number} RewardLength Reward Length
     * @param {string} Publisher Publisher
     * @returns {Promise<Reward>}
    */
    async CreateReward(APIKey, ConnectedProject, Name, URLs, Webhook, AntiBypassToken, RewardLength, Publisher) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.reward.create({
                    data: {
                        APIKey,
                        ConnectedProject,
                        Name,
                        URLs,
                        Webhook,
                        AntiBypassToken,
                        RewardLength,
                        Publisher
                    }
                });
                resolve(result);
            } catch (er) {
                resolve();
                console.log(er);
            }
        });
    }

    /**
     * @param {string} ConnectedProject Associated Project ID
     * @returns {Promise<Reward>}
    */
    async GetReward(ConnectedProject) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.reward.findUnique({
                    where: { ConnectedProject }
                });
                resolve(result);
            } catch (er) {
                resolve();
                console.log(er);
            }
        });
    }

    /**
     * @param {string} RewardID Reward ID
     * @returns {Promise<Reward>}
    */
    async DeleteReward(RewardID) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.reward.delete({
                    where: { id: RewardID }
                });
                resolve(result);
            } catch (er) {
                resolve();
                console.log(er);
            }
        });
    }

    /**
     * @param {string} APIKey User API Key
     * @returns {Promise<Reward>}
    */
    async GetUserRewards(APIKey) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.reward.findMany({
                    where: { APIKey }
                });
                resolve(result);
            } catch (er) {
                console.log(er);
            }
        });
    }

    /**
     * @param {string} ConnectedProject Associated Project ID
     * @returns {Promise<Reward>}
    */
    async IncrementRewardUses(ConnectedProject) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.reward.update({
                    where: { ConnectedProject },
                    data: {
                        Uses: {
                            increment: 1
                        }
                    }
                });
                resolve(result);
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} ConnectedProject Associated Project ID
     * @returns {Promise<Reward>}
    */
    async IncrementRewardBypasses(ConnectedProject) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.reward.update({
                    where: { ConnectedProject },
                    data: {
                        AttemptedBypasses: {
                            increment: 1
                        }
                    }
                });
                resolve(result);
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} Serial Serial Key
     * @param {number} Months Subscription Months 
     * @returns {Promise<Serial>}
    */
    async CreateSerial(Serial, Months) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.serial.create({
                    data: {
                        Serial,
                        Months
                    }
                })
                resolve(result)
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    
    /**
     * @param {string} Serial Serial Key
     * @returns {Promise<Serial>}
    */
    async DeleteSerial(Serial) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.serial.delete({
                    where: {
                        Serial
                    }
                });
                resolve(result)
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    /**
     * @param {string} Serial Serial Key
     * @returns {Promise<Serial>}
    */
    async GetSerial(Serial) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.serial.findUnique({
                    where: {
                        Serial
                    }
                });
                resolve(result)
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    async GetUserCount() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.user.count();
                resolve(result);
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

    async GetAllProjectStats() {
        return new Promise(async (resolve) => {
            try {
                const result = await prisma.project.aggregate({
                    _sum: {
                        UserCount: true,
                        ExecutionCount: true
                    },
                    _count: true
                })
                resolve(result);
            } catch (er) {
                console.log(er);
                resolve();
            }
        });
    }

        /**
     * @param {string} OrderID Order ID
     * @param {string} OwnerID ID of the User who Created Invoice
     * @param {number} Conversations Amount of Conversations
     * @param {string} Amount Amount in USD
     * @returns {Promise<Invoice>}
    */
    async SubscriptionCreateCryptoInvoice(OrderID, OwnerID, Months, Amount, Plan) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.invoice.create({
                    data: {
                        OrderID,
                        OwnerID,
                        Months,
                        Amount,
                        Plan,
                        Type: "Crypto"
                    }
                });
                resolve(result);
            } catch (er) {
                console.log(er);
                reject(er);
            }
        });
    }

    /**
     * @param {string} OrderID Order ID
     * @param {string} OwnerID ID of the User who Created Invoice
     * @param {number} Conversations Amount of Conversations
     * @param {string} Amount Amount in USD
     * @returns {Promise<Invoice>}
    */
    async SubscriptionCreateStripeInvoice(OrderID, OwnerID, Months, Amount, Plan) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.invoice.create({
                    data: {
                        OrderID,
                        OwnerID,
                        Months,
                        Amount,
                        Plan,
                        Type: "Card"
                    }
                });
                resolve(result);
            } catch (er) {
                console.log(er);
                reject(er);
            }
        });
    }

    async GetUserFromID(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await prisma.user.findUnique({ where: { id } })
                resolve(result);
            } catch (er) {
                reject(er);
            }
        });
    }

    async UpdateSubscriptionAndInvoiceSuccess(UserID, OrderID, DateEnd, Plan) {
        return new Promise(async (resolve, reject) => {
            try {
                prisma.$transaction(async (tx) => {
                    await tx.user.update({
                        where: { id: UserID },
                        data: {
                            SubscriptionType: Plan,
                            SubscriptionEnd: DateEnd
                        }
                    });

                    await tx.invoice.update({
                        where: { OrderID },
                        data: {
                            Status: "paid"
                        }
                    });
                    resolve();
                });
            } catch (er) {
                reject(er);
            }
        });
    }

    /**
     * This function is a bit fuckery, but it's just to be extra extra safe.
     * @param {string} ProjectID Associated Project ID
     * @returns {Promise<Array<License>>}
    */
    async WipeDatabase(ProjectID) {
        // Just in case lmfaoo
        if (!ProjectID) {
            return console.error("FATAL, NO PROJECT ID SUPPLIED, WILL DELETE ALL RECORDS YOU FUCKING RETARD");
        }

        if (typeof(ProjectID) !== "string") {
            return console.error("FATAL, NO PROJECT ID SUPPLIED, WILL DELETE ALL RECORDS YOU FUCKING RETARD");
        }

        if (ProjectID === undefined) {
            return console.error("FATAL, NO PROJECT ID SUPPLIED, WILL DELETE ALL RECORDS YOU FUCKING RETARD");
        }

        return new Promise(async (resolve, reject) => {
            try {
                await prisma.$transaction(async (tx) => {
                    const Count = await tx.license.aggregate({
                        where: { ProjectID: ProjectID },
                        _count: true
                    });

                    await tx.project.update({
                        where: { id: ProjectID },
                        data: {
                            UserCount: {
                                decrement: Count._count
                            }
                        }
                    });

                    const result = await tx.license.deleteMany({
                        where: { ProjectID: ProjectID }
                    });

                    resolve(result);
                });
            } catch (er) {
                reject(er);
            }
        });
    }
}