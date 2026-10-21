const Fastify = require("fastify");

const port = Number(process.env.PORT) || 3000;
const todos = [
  "Buy groceries",
  "Read a Kubernetes chapter",
  "Walk the dog",
];

const app = Fastify({ logger: false });

app.get("/todos", async (_req, reply) => {
  reply.send(todos);
});

app.post("/todos", async (req, reply) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) {
    reply.code(400).send({ error: "Todo cannot be empty." });
    return;
  }
  if (text.length > 140) {
    reply.code(400).send({ error: "Todo must be 140 characters or less." });
    return;
  }
  todos.push(text);
  reply.code(201).send({ text });
});

app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`Server started in port ${port}`);
});
