module.exports = {
    RegLoginSchema: {
        type: "object",
        properties: {
            Email: { type: "string", minLength: 1, maxLength: 320 },
            Password: { type: "string", minLength: 6, maxLength: 20 }
        },
        required: ["Email", "Password"]
    },
    GetAPIKeyParamSchema: {
        type: "object",
        properties: {
            APIKey: { type: "string" }
        },
        required: ["APIKey"]
    },
    APIKeyHeader: {
        type: "object",
        properties: {
            Authorization: { type: "string" }
        },
        required: ["Authorization"]
    },
    CreateProjectSchema: {
        type: "object",
        properties: {
            Name: { type: "string", minLength: 1, maxLength: 20 },
            Webhook: { type: "string" }
        },
        required: ["Name", "Webhook"]
    },
    GetProjectSchemaParam: {
        type: "object",
        properties: {
            id: { type: "string" }
        },
        required: ["id"]
    },
    GetLicenseFromLicenseKey: {
        type: "object",
        properties: {
            id: { type: "string" },
            licenseKey: { type: "string" }
        },
        required: ["id", "licenseKey"]
    },
    GetLicenseFromDiscordID: {
        type: "object",
        properties: {
            id: { type: "string" },
            discordID: { type: "string" }
        },
        required: ["id", "discordID"]
    },
    CreateLicenseSchema: {
        type: "object",
        properties: {
            DiscordID: { type: "string", maxLength: 20 },
            HWID: { type: "string" },
            Expiry: { type: "number" }
        }
    },
    WipeLicensesSchema: {
        type: "object",
        properties: {
            Password: { type: "string" },
            Token: { type: "string" }
        },
        required: ["Password", "Token"]
    },
    UpdateLicenseSchema: {
        type: "object",
        properties: {
            Key: { type: "string" },
            DiscordID: { type: "string", maxLength: 20 },
            HWID: { type: "string" },
            Expiry: { type: "number" }
        },
        required: ["Key"]
    },
    DeleteLicenseSchema: {
        type: "object",
        properties: {
            Key: { type: "string" }
        },
        required: ["Key"]
    },
    BillingSchema: {
        type: "object",
        properties: {
            Months: { type: "number" }
        },
        required: ["Months"]
    },
    GetLoaderQuerySchema: {
        type: "object",
        properties: {
            api_key: { type: "string" }
        },
        required: ["api_key"]
    },
    AuthParamSchema: {
        type: "object",
        properties: {
            urlToken: { type: "string" },
            projectID: { type: "string" },
            key: { type: "string" },
            token: { type: "string" },
            second_token: { type: "string" },
            third_token: { type: "string" },
            fourth_token: { type: "string" }
        },
        required: ["urlToken", "projectID", "key", "token", "second_token", "third_token", "fourth_token"]
    },
    BlacklistLicenseSchema: {
        type: "object",
        properties: {
            Key: { type: "string" },
            Blacklisted: { type: "boolean" },
            BlacklistReason: { type: "string", minLength: 1, maxLength: 50 }
        },
        required: ["Key", "Blacklisted"]
    },
    RewardRedeemQuerySchema: {
        type: "object",
        properties: {
            id: { type: "string" }
        },
        required: ["id"]
    },
    CreateRewardBodySchema: {
        type: "object",
        properties: {
            AssoicatedProject: { type: "string" },
            Name: { type: "string", minLength: 1, maxLength: 20 },
            URLs: { type: "array" },
            Webhook: { type: "string" },
            AntiBypassToken: { type: "string" },
            RewardLength: { type: "number" },
            Publisher: { type: "string" }
        },
        required: ["AssoicatedProject", "Name", "URLs", "Webhook", "RewardLength", "AntiBypassToken", "Publisher"]
    },
    CreateScriptSchema: {
        type: "object",
        properties: {
            Name: { type: "string", minLength: 1, maxLength: 20 },
            Content: { type: "string" },
            Roblox: { type: "boolean" }
        },
        required: ["Name", "Content", "Roblox"]
    },
    UpdateScriptSchema: {
        type: "object",
        properties: {
            Name: { type: "string", minLength: 1, maxLength: 20 },
            Content: { type: "string" },
            Roblox: { type: "boolean" }
        },
        required: ["Content", "Roblox", "Name"]
    },
    GenerateLicensesSchema: {
        type: "object",
        properties: {
            Amount: { type: "number", minimum: 1, maximum: 100 },
            Token: { type: "string" },
            Expiry: { type: "number" }
        },
        required: ["Amount", "Token"]
    },
    CreateStorageKeySchema: {
        type: "object",
        properties: {
            Key: { type: "string", minLength: 1, maxLength: 100 },
            Value: { type: "string", minLength: 1, maxLength: 100 }
        },
        required: ["Key", "Value"]
    },
    DeleteStorageKeySchema: {
        type: "object",
        properties: {
            Key: { type: "string", minLength: 1, maxLength: 100 }
        },
        required: ["Key"]
    },
    CreateTicketSchema: {
        type: "object",
        properties: {
            Message: { type: "string", minLength: 1, maxLength: 2000 }
        },
        required: ["Message"]
    },
    DeleteRewardSchema: {
        type: "object",
        properties: {
            id: { type: "string" }
        },
        required: ["id"]
    },
    RedeemSerialSchema: {
        type: "object",
        properties: {
            serial: { type: "string" },
            captcha: { type: "string" }
        },
        required: ["serial", "captcha"]
    },
    CreateSerialSchema: {
        type: "object",
        properties: {
            months: { type: "number" }
        },
        required: ["months"]
    },
    LoaderGenerateOptionsSchema: {
        type: "object",
        properties: {
            keyGUI: { type: "boolean" }
        },
        required: ["keyGUI"]
    },
    SubscriptionInvoiceCreateSchema: {
        type: "object",
        properties: {
            months: { type: "number", minimum: 1 },
            plan: { type: "string" } 
        },
        required: ["months", "plan"]
    },
    IPNPaymentHeader: {
        type: "object",
        properties: {
            ["x-nowpayments-sig"]: { type: "string" }
        },
        required: ["x-nowpayments-sig"]
    },
    StripeSignature: {
        type: "object",
        properties: {
            ["stripe-signature"]: { type: "string" }
        },
        required: ["stripe-signature"]
    }
};