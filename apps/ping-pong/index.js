const fs = require("fs");
const Fastify = require("fastify");

const port = Number(process.env.PORT) || 3000;
const pingFile = process.env.PING_FILE || "pingpong.txt";

const readCount = () => {
  try {
    const raw = fs.readFileSync(pingFile, "utf8").trim();
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
};

let counter = readCount();

const pong = async (_req, reply) => {
  reply.type("text/plain").send(`pong ${counter}\n`);
  counter += 1;
  fs.writeFileSync(pingFile, String(counter));
};

const app = Fastify({ logger: false });

app.get("/pingpong", pong);
app.get("/pingpong/", pong);

app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`Server started in port ${port}`);
});
