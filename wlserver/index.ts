import express from 'express';
import logger, { expressLogger } from './src/logger';
import http from 'http';
import { Server } from 'socket.io';
import auth, { asValidClientType } from './src/auth';
import { deregisterToken, registerToken } from './src/connections';

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

    socket.on('authenticate', async (payload) => {
        const { id, mode, pass } = payload;

        try {
            if (
                typeof id === 'number' &&
                typeof pass === 'string' &&
                asValidClientType(mode)
            ) {
                const token = await auth(mode, id, pass);
                registerToken(token);
                socket.emit('auth_ok', token);
                logger.log('info', `Auth success: mode ${mode} id ${id}`);
                socket.on('disconnect', () => {
                    deregisterToken(token);
                    logger.log(
                        'info',
                        `Authenticated user disconnected: mode ${mode} id ${id}`
                    );
                });
            } else {
                throw 'malformed_request';
            }
        } catch (e) {
            socket.emit('error', e);
        }
    });
});

server.listen(PORT, () => {
    logger.log('info', `[server]: Server is running on *:${PORT}`);
});
