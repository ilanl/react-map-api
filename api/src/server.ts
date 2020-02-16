import express from 'express';
import Server from 'socket.io';
import http from 'http';
import App from "./app";
import { PORT, SOCKET_PORT } from "./server.constants";

const app = express();
const io = Server(new http.Server(app), {
  allowUpgrades: true,
  transports: [ 'polling', 'websocket' ],
  pingTimeout: 9000,
  pingInterval: 3000,
  cookie: 'mycookie',
  httpCompression: true,
  origins: '*:*'
});

const AppServer = new App(app, io);
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  AppServer.io.listen(SOCKET_PORT);
});
