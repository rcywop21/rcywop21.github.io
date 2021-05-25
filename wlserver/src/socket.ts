import express from 'express';
import logger, { expressLogger } from './logger';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 8000;
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';
const ALLOWED_ORIGINS =
    (process.env.ORIGINS && process.env.ORIGINS.split(',')) || '*';

const server = http.createServer(app);
logger.log('info', `allowed origins: ${ALLOWED_ORIGINS}`);

export const io = new Server(server, {
    cors: { origin: ALLOWED_ORIGINS },
});

app.use(expressLogger);
app.get('/', (_, res) => res.send('This is a backend server.'));

export const listen = (): http.Server =>
    server.listen(PORT, HOSTNAME, () => {
        logger.log('info', `[server]: Server is running on *:${PORT}`);
    });
