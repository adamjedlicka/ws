const ws = require("ws");
const http = require("http");
const express = require("express");

const app = express();

app.use(express.static("public"));

const server = http.createServer(app);

const wss = new ws.Server({ server });

const connections = new Set();

let counter = 1;

wss.on("connection", (ws) => {
  const id = counter++;

  connections.add(ws);

  ws.on("close", () => {
    connections.delete(ws);
  });

  ws.on("message", (data) => {
    for (const connection of connections) {
      connection.send(
        JSON.stringify({
          ...JSON.parse(data),
          id,
        })
      );
    }
  });
});

server.listen(8080);
