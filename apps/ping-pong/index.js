const Fastify = require("fastify");

const port = Number(process.env.PORT) || 3000;
let counter = 0;

const app = Fastify({ logger: false });

const pong = async (_req, reply) => {
  reply.type("text/plain").send(`pong ${counter}\n`);
  counter += 1;
};

app.get("/pingpong", pong);
app.get("/pingpong/", pong);
app.get("/pings", async (_req, reply) => {
  reply.type("text/plain").send(String(counter));
});

app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`Server started in port ${port}`);
});
