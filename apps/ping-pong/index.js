const http = require("http");

const port = process.env.PORT || 3000;
let counter = 0;

const server = http.createServer((req, res) => {
  const path = new URL(req.url, `http://${req.headers.host}`).pathname;

  if (req.method === "GET" && (path === "/pingpong" || path === "/pingpong/")) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`pong ${counter++}\n`);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found\n");
});

server.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
