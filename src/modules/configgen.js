const { Random } = require("random");

module.exports = () => {
    const random = new Random();
    return {
        JSON_STRING_OP: random.int(0, 999),
        JSON_INT_OP: random.int(0, 999),
        JSON_OBJ_OP: random.int(0, 999),
        JSON_BOOL_OP: random.int(0, 999),
        JSON_FLOAT_OP: random.int(0, 999),
        _UNIQUETOKEN: crypto.randomUUID().split("-").join("").slice(0, 5),
        _INTERVALKEY: random.int(0, 99999),
        
        // Strings Only
        _RESPONSE_TOKEN_INDEX: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_INTERINDEX: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_LOADER_HASH: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_BYTECODE: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_FINGERPRINT: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_USERKEY: crypto.randomUUID().split("-").join("").slice(0, 5), 

        _RESPONSE_STORAGE: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_BLACKLIST_OBJECT: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_BLACKLISTED_BOOL: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_BLACKLISTED_REASON: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_USER_OBJECT: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_TIMESTAMP: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_RNG: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_SECONDARY_RNG: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_THIRD_RNG: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_FOUTH_RNG: crypto.randomUUID().split("-").join("").slice(0, 5),

        // URL Token
        _URL_TOKEN: crypto.randomUUID().split("-").join("").slice(0, 5),

        _METATABLEKEYONE: crypto.randomUUID().split("-").join("").slice(0, 5),
        _METATABLEKEYTWO: random.int(0, 9999999),
        _PROXYKEYONE: crypto.randomUUID().split("-").join("").slice(0, 5),
        _PROXYKEYTWO: random.int(0, 9999999),
        _PROXYKEYTHREE: crypto.randomUUID().split("-").join("").slice(0, 5),

        // VM SHIT
        _OPCODE_INDEX: crypto.randomUUID().split("-").join("").slice(0, 5),
        _A_REGISTER: crypto.randomUUID().split("-").join("").slice(0, 5),
        _B_REGISTER: crypto.randomUUID().split("-").join("").slice(0, 5),
        _RESPONSE_VM_BYTECODE: crypto.randomUUID().split("-").join("").slice(0, 5),
        _VM_INTEGRITY_KEY: random.int(0, 9999999),

        // RNG SHIT
        _RNG_ADDITION_KEY: random.int(100, 9999999),
        _RNG_SEED: random.int(999, 9999999),
        _RNG_INTERVAL_ONE: random.int(100, 800),
        _RNG_INTERVAL_TWO: random.int(100, 800),

        // REQUEST PROXY
        _REQUEST_PROXY_INTER_KEY: random.int(100, 900),
        _REQUEST_PROXY_LEN_KEY: random.int(100, 900),
        
    }
}