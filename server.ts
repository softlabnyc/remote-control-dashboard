import express from 'express';
import next from 'next';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import createWSSHandler from './src/server/createWSSHandler';
const { parse } = require('url');

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) =>
    handle(req, res, parse(req.url, true))
  );
  const wss = new WebSocketServer({ noServer: true });
  const handler = createWSSHandler(wss);

  wss.on('connection', async function connection(ws) {
    ws.once('close', () => {});
  });

  server.on('upgrade', function (req, socket, head) {
    const { pathname } = parse(req.url, true);
    if (pathname !== '/_next/webpack-hmr') {
      wss.handleUpgrade(req, socket, head, function done(ws) {
        wss.emit('connection', ws, req);
      });
    }
  });

  process.on('SIGTERM', () => {
    handler.broadcastReconnectNotification();
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
