import { io, listen } from './src/socket';
import authenticateSocket from './src/connections';
import {
    onAcceptHandler,
    onActionHandler,
    onPauseHandler,
    onRejectionHandler,
    onTravelHandler,
} from './src/socketHandlers';
import { onAdminHandler } from './src/admin';
import logger from './src/logger';
import setupGameState from './src/startup';
import onTick from './src/tick';
import onBackup from './src/backup';

setupGameState();

io.on('connection', (socket) => {
    logger.log('info', 'New client connected');

    socket.on('authenticate', (payload, reply) =>
        authenticateSocket(socket, payload, reply, io)
    );
    socket.on('action', (payload, reply) =>
        onActionHandler(socket, payload, reply, io)
    );
    socket.on('action_reject', (reply) =>
        onRejectionHandler(socket, undefined, reply, io)
    );
    socket.on('action_ok', (reply) =>
        onAcceptHandler(socket, undefined, reply, io)
    );
    socket.on('travel', (payload, reply) =>
        onTravelHandler(socket, payload, reply, io)
    );
    socket.on('admin', (payload, reply) =>
        onAdminHandler(socket, payload, reply, io)
    );
    socket.on('pause', (payload, reply) =>
        onPauseHandler(socket, payload, reply, io)
    );
});

setInterval(onTick, 500);
setInterval(onBackup, 3000);

listen();
