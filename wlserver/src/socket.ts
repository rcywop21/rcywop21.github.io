import express from 'express';
import logger, { expressLogger } from './logger';
import http from 'http';
import { Server } from 'socket.io';
import { ALLOWED_ORIGINS, HOSTNAME, NODE_ENV, PORT } from './config';

const app = express();

const server = http.createServer(app);
logger.log('info', `allowed origins: ${ALLOWED_ORIGINS}`);

export const io = new Server(server, {
    cors: { origin: ALLOWED_ORIGINS },
});

app.use(expressLogger);
app.get('/', (_, res) => res.send('This is a backend server.'));

export const listen = (): http.Server =>
    server.listen(PORT, HOSTNAME, () => {
        logger.log('info', `[server]: Server is running in ${NODE_ENV}`);
        logger.log('info', `[server]: Server is running on ${HOSTNAME}:${PORT}`);
    });
