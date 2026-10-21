const fs = require("fs");
const Fastify = require("fastify");

const port = Number(process.env.PORT) || 3000;
const logFile = process.env.LOG_FILE || "log.txt";
const pingpongUrl = process.env.PINGPONG_URL || "http://ping-pong:3000";

const app = Fastify({ logger: false });

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
    const res = await fetch(`${pingpongUrl}/pings`);
    if (res.ok) {
      const raw = (await res.text()).trim();
      if (raw) pings = raw;
    }
  } catch {
    // ping-pong is not reachable
  }

  reply.type("text/plain; charset=utf-8").send(`${last}\nPing / Pongs: ${pings}\n`);
});

app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`Server started in port ${port}`);
});
