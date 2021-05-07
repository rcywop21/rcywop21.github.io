import express from 'express';
import logger, { expressLogger } from './src/logger';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 8000;
const ALLOWED_ORIGINS = (process.env.ORIGINS && process.env.ORIGINS.split(',')) || '*'

const server = http.createServer(app);
logger.log('info', ALLOWED_ORIGINS);

const io = new Server(server, {
    cors: { origin: ALLOWED_ORIGINS }
});

app.use(expressLogger);

app.get('/', (_, res) => res.send('This is a backend server.'));

io.on('connection', (socket) => {
    logger.log('info', 'New client connected');
    socket.on('disconnect', () => {
        logger.log('info', 'Client disconnected');
    })
})

server.listen(PORT, () => {
    logger.log('info', '[server]: Server is running on *:{PORT}')
})
