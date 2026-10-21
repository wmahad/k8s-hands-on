const fs = require("fs");
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
const logFile = env("LOG_FILE");
const pingsUrl = env("PINGS_URL");
const informationFile = env("INFORMATION_FILE");
const message = env("MESSAGE");

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
    const res = await fetch(pingsUrl);
    if (res.ok) {
      const raw = (await res.text()).trim();
      if (raw) pings = raw;
    }
  } catch {
    // ping-pong is not reachable
  }

  let fileContent = "";
  try {
    fileContent = fs.readFileSync(informationFile, "utf8").trim();
  } catch {
    fileContent = "";
  }

  reply
    .type("text/plain; charset=utf-8")
    .send(
      `file content: ${fileContent}\nenv variable: MESSAGE=${message}\n${last}\nPing / Pongs: ${pings}\n`,
    );
});

app.listen({ port, host }).then(() => {
  console.log(`Server started in port ${port}`);
});
