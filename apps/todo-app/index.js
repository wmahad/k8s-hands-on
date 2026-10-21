const crypto = require("crypto");
const http = require("http");

const port = process.env.PORT || 3000;
const randomString = crypto.randomUUID();

const status = () => ({
  timestamp: new Date().toISOString(),
  randomString,
});

const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Todo app</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; }
    h1 { font-size: 1.5rem; }
    form { display: flex; gap: 0.5rem; }
    input { flex: 1; padding: 0.5rem; }
    button { padding: 0.5rem 0.75rem; }
    li { margin: 0.35rem 0; }
  </style>
</head>
<body>
  <h1>Todo app</h1>
  <form id="todo-form">
    <input id="todo-input" type="text" placeholder="Add a todo" autocomplete="off">
    <button type="submit">Add</button>
  </form>
  <ul id="todo-list"></ul>
  <script>
    const form = document.getElementById("todo-form");
    const input = document.getElementById("todo-input");
    const list = document.getElementById("todo-list");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      const item = document.createElement("li");
      item.textContent = text;
      list.appendChild(item);
      input.value = "";
    });
  </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  const path = new URL(req.url, `http://${req.headers.host}`).pathname;

  if (req.method === "GET" && path === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(page);
    return;
  }

  if (req.method === "GET" && path === "/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(status(), null, 2));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found\n");
});

server.listen(port, () => {
  const { timestamp } = status();
  console.log(`Server started in port ${port}`);
  console.log(`${timestamp} ${randomString}`);
});
