const crypto = require("crypto");
const fs = require("fs");

const env = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing ${name}`);
  }
  return value;
};

const logFile = env("LOG_FILE");
const intervalMs = Number(env("WRITE_INTERVAL_MS"));
const randomString = crypto.randomUUID();

const writeLine = () => {
  const line = `${new Date().toISOString()}: ${randomString}.\n`;
  fs.appendFileSync(logFile, line);
  console.log(line.trimEnd());
};

writeLine();
setInterval(writeLine, intervalMs);
