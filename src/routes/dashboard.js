const database = require("../modules/database");
const schemas = require("../modules/schemas");

const Database = new database();

/**
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
*/
async function AuthenticationHandler(request, reply) {
    const Cookie = request.headers["cookie"];
    if (!Cookie) {
        return reply.view("login/index.ejs");
    }
    
    const Field = decodeURIComponent(Cookie).split(";").find(x => x.match("authorization"));
    if (!Field) {
        return reply.view("login/index.ejs");
    }

    const Authorization = Field.split("=").pop();
    const User = await Database.GetUserEx(Authorization);
    if (!User) {
        return reply.view("login/index.ejs");
    }

    request.Authorization = Authorization;
    request.User = User;
}

/**
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
*/
async function routes(fastify, options) {	
    fastify.get("/", { preHandler: AuthenticationHandler }, (request, reply) => {
        reply.view("dashboard/index.ejs", {
            authorization: request.Authorization
        });
    });

    fastify.get("/documents", (request, reply) => {
        reply.view("dashboard/documents.ejs")
    });

    fastify.get("/redeem", { preHandler: AuthenticationHandler }, (request, reply) => {
        reply.view("dashboard/redeem.ejs", {
            authorization: request.Authorization
        });
    });

    fastify.get("/projects/:id/", { preHandler: AuthenticationHandler }, (request, reply) => {
        reply.view("dashboard/project.ejs", {
            authorization: request.Authorization,
            id: request.params.id
        });
    });

    fastify.get("/settings", { preHandler: AuthenticationHandler }, (request, reply) => {
        reply.view("dashboard/settings.ejs", {
            authorization: request.Authorization,
            id: request.params.id
        });
    });

    fastify.get("/rewards", { preHandler: AuthenticationHandler }, (request, reply) => {
        reply.view("dashboard/rewards.ejs", {
            authorization: request.Authorization,
        });
    });

    fastify.get("/upload", { preHandler: AuthenticationHandler }, (request, reply) => {
        reply.view("dashboard/upload.ejs", {
            authorization: request.Authorization,
        });
    });

    fastify.get("/storage", { preHandler: AuthenticationHandler }, (request, reply) => {
        reply.view("dashboard/storage.ejs", {
            authorization: request.Authorization,
        });
    });

    fastify.get("/tickets", { preHandler: AuthenticationHandler }, (request, reply) => {
        reply.view("dashboard/tickets.ejs", {
            authorization: request.Authorization,
        });
    });

    fastify.get("/tickets/:id/", { preHandler: AuthenticationHandler }, (request, reply) => {
        reply.view("dashboard/ticket.ejs", {
            authorization: request.Authorization,
            id: request.params.id
        });
    });

    fastify.get("/login", (request, reply) => reply.view("login/index.ejs"));
    fastify.get("/register", (request, reply) => reply.view("register/index.ejs"));
}

module.exports = routes;