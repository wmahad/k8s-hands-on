const fs = require("fs");
const path = require("path");
const Fastify = require("fastify");
const view = require("@fastify/view");
const pug = require("pug");
const { prepareImage, readImage } = require("./image");

const port = Number(process.env.PORT) || 3000;
const logFile = process.env.LOG_FILE || "log.txt";
const pingFile = process.env.PING_FILE || "pingpong.txt";

const todos = [
  "Buy groceries",
  "Read a Kubernetes chapter",
  "Walk the dog",
];

const app = Fastify({ logger: false });

const start = async () => {
  await app.register(view, {
    engine: { pug },
    root: path.join(__dirname, "views"),
    viewExt: "pug",
  });

  app.get("/", async (_req, reply) => {
    return reply.view("index", { todos });
  });

  app.get("/image", async (_req, reply) => {
    try {
      await prepareImage();
      const { buffer, contentType } = readImage();
      reply.type(contentType).send(buffer);
    } catch {
      reply.code(502).send("could not load image\n");
    }
  });

  app.get("/crash", async (_req, reply) => {
    reply.send("crashing\n");
    setImmediate(() => process.exit(1));
  });

  app.get("/status", async (_req, reply) => {
    let data;
    try {
      data = fs.readFileSync(logFile, "utf8");
    } catch {
      reply.code(503).send("log not ready\n");
      return;
    }

    const lines = data.trim().split("\n").filter(Boolean);
    const last = lines[lines.length - 1] || "";
    let pings = "0";
    try {
      const raw = fs.readFileSync(pingFile, "utf8").trim();
      if (raw) pings = raw;
    } catch {
      // ping-pong has not written yet
    }

    reply.type("text/plain; charset=utf-8").send(`${last}\nPing / Pongs: ${pings}\n`);
  });

  await app.listen({ port, host: "0.0.0.0" });
  console.log(`Server started in port ${port}`);
};

start();
