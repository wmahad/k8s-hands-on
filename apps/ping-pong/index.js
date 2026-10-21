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
env("PGHOST");
env("PGPORT");
env("PGUSER");
env("PGPASSWORD");
env("PGDATABASE");

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
    CREATE TABLE IF NOT EXISTS counter (
      id INT PRIMARY KEY,
      value INT NOT NULL
    )
  `);
  await pool.query(
    "INSERT INTO counter (id, value) VALUES (1, 0) ON CONFLICT (id) DO NOTHING",
  );

  const app = Fastify({ logger: false });

  const pong = async (_req, reply) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query(
        "SELECT value FROM counter WHERE id = 1 FOR UPDATE",
      );
      const n = rows[0].value;
      await client.query("UPDATE counter SET value = $1 WHERE id = 1", [n + 1]);
      await client.query("COMMIT");
      reply.type("text/plain").send(`pong ${n}\n`);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  };

  app.get("/pingpong", pong);
  app.get("/pingpong/", pong);
  app.get("/pings", async (_req, reply) => {
    const { rows } = await pool.query("SELECT value FROM counter WHERE id = 1");
    reply.type("text/plain").send(String(rows[0].value));
  });

  await app.listen({ port, host });
  console.log(`Server started in port ${port}`);
};

start();
