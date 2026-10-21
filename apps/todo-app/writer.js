const crypto = require("crypto");
const fs = require("fs");

const logFile = process.env.LOG_FILE || "log.txt";
const randomString = crypto.randomUUID();

const writeLine = () => {
  const line = `${new Date().toISOString()} ${randomString}\n`;
  fs.appendFileSync(logFile, line);
  console.log(line.trimEnd());
};

writeLine();
setInterval(writeLine, 5000);
