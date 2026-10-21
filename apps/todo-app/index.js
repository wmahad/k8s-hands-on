const path = require("path");
const Fastify = require("fastify");
const view = require("@fastify/view");
const pug = require("pug");
const { prepareImage, readImage } = require("./image");

const port = Number(process.env.PORT) || 3000;
const todoBackendUrl = process.env.TODO_BACKEND_URL || "http://todo-backend:3000";

const app = Fastify({ logger: false });

const start = async () => {
  await app.register(view, {
    engine: { pug },
    root: path.join(__dirname, "views"),
    viewExt: "pug",
  });

  app.get("/", async (_req, reply) => {
    let todos = [];
    try {
      const res = await fetch(`${todoBackendUrl}/todos`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) todos = data;
      }
    } catch {
      // todo-backend is not reachable
    }
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

  await app.listen({ port, host: "0.0.0.0" });
  console.log(`Server started in port ${port}`);
};

start();
