import express from 'express';
import logger, { expressLogger } from './src/logger';
import http from 'http';
import { Server } from 'socket.io';
import authenticateSocket from './src/connections';
import { onActionHandler } from './src/socketHandlers';

const app = express();
const PORT = process.env.PORT || 8000;
const ALLOWED_ORIGINS =
    (process.env.ORIGINS && process.env.ORIGINS.split(',')) || '*';

const server = http.createServer(app);
logger.log('info', `allowed origins: ${ALLOWED_ORIGINS}`);

const io = new Server(server, {
    cors: { origin: ALLOWED_ORIGINS },
});

app.use(expressLogger);

app.get('/', (_, res) => res.send('This is a backend server.'));

io.on('connection', (socket) => {
    logger.log('info', 'New client connected');

    socket.on('authenticate', (payload, reply) => authenticateSocket(socket, payload, reply));
    socket.on('action', (payload, reply) => onActionHandler(socket, payload, reply));
});

server.listen(PORT, () => {
    logger.log('info', `[server]: Server is running on *:${PORT}`);
});
