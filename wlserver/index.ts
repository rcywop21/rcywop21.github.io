import express from 'express';
import logger, { expressLogger } from './src/logger';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const app = express();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const io = new Server(server);

app.use(expressLogger);

app.get('/', (_, res) => res.send('Express + TypeScript Server'));

io.on('connection', (socket: Socket<DefaultEventsMap, DefaultEventsMap>): void => {
    logger.log('info', 'New client connected');
    socket.on('disconnect', (): void => {
        logger.log('info', 'Client disconnected');
    })
})

app.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`)
})
