const Fastify = require("fastify");

const env = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing ${name}`);
  }
  return value;
};

const host = env("HOST");
const port = Number(env("PORT"));
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

app.listen({ port, host }).then(() => {
  console.log(`Server started in port ${port}`);
});
