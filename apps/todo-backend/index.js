const Fastify = require("fastify");
const { Pool } = require("pg");

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
env("PGHOST");
env("PGPORT");
env("PGUSER");
env("PGPASSWORD");
env("PGDATABASE");

const seedTodos = [
  "Buy groceries",
  "Read a Kubernetes chapter",
  "Walk the dog",
];

const pool = new Pool();

const waitForDb = async () => {
  for (;;) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

const start = async () => {
  await waitForDb();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL
    )
  `);
  const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM todos");
  if (rows[0].n === 0) {
    await pool.query("INSERT INTO todos (text) SELECT unnest($1::text[])", [
      seedTodos,
    ]);
  }

  const app = Fastify({ logger: false });

  app.get("/todos", async (_req, reply) => {
    const result = await pool.query("SELECT text FROM todos ORDER BY id");
    reply.send(result.rows.map((row) => row.text));
  });

  app.post("/todos", async (req, reply) => {
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text) {
      reply.code(400).send({ error: "Todo cannot be empty." });
      return;
    }
    if (text.length > todoMaxLength) {
      reply.code(400).send({
        error: `Todo must be ${todoMaxLength} characters or less.`,
      });
      return;
    }
    await pool.query("INSERT INTO todos (text) VALUES ($1)", [text]);
    reply.code(201).send({ text });
  });

  await app.listen({ port, host });
  console.log(`Server started in port ${port}`);
};

start();
