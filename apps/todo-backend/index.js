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
const todoMaxLength = Number(env("TODO_MAX_LENGTH"));
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
  if (text.length > todoMaxLength) {
    reply.code(400).send({ error: `Todo must be ${todoMaxLength} characters or less.` });
    return;
  }
  todos.push(text);
  reply.code(201).send({ text });
});

app.listen({ port, host }).then(() => {
  console.log(`Server started in port ${port}`);
});
