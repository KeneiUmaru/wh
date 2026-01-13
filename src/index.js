const { existsSync, mkdirSync } = require("fs");
const path = require("path");
const fastify = require("fastify")();
require("dotenv").config()

fastify.addHook("preHandler", (request, reply, done) => {
    request.IPAddress = request.headers["cf-connecting-ip"] || request.ip;
    done();
});

fastify.register(require("@fastify/rate-limit"), {
    max: 100,
    timeWindow: "1 minute",
    keyGenerator: function (request) {
        return request.headers["cf-connecting-ip"] || request.ip;
    }
});

fastify.register(require("./routes/auth.js"), { prefix: "/auth/" });
fastify.register(require("./routes/api.js"), { prefix: "/api/" });
fastify.register(require("./routes/rewards.js"), { prefix: "/rewards/" });
fastify.register(require("./routes/scripts.js"), { prefix: "/scripts/" });

fastify.register(require("@fastify/view"), {
    engine: {
        ejs: require("ejs")
    },
    root: path.join(__dirname, "./ejs")
});

fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "public")
});

fastify.register(require("./routes/dashboard.js"), { prefix: "/dashboard/" });

if (!existsSync(path.join(__dirname, "../loaders"))) {
    mkdirSync(path.join(__dirname, "../loaders"));
}

if (!existsSync(path.join(__dirname, "../scripts"))) {
    mkdirSync(path.join(__dirname, "../scripts"));
}

if (!existsSync(path.join(__dirname, "../tickets"))) {
    mkdirSync(path.join(__dirname, "../tickets"));
}

(async () => {
    await fastify.listen({ port: 8082 }, (err) => {
        if (err) throw err;
        console.log("Listening to port 8082");
    });
})();