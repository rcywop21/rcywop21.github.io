import auth, { asValidClientType, ClientType } from './auth';
import { SocketHandler } from './socketHandlers';
import logger from './logger';
import { gameState } from './stateMgr';
import { GlobalState, PlayerState, TeamId } from 'wlcommon';
import { io } from './socket';

export interface Credentials {
    groupNum: TeamId;
    clientType: ClientType;
}

export const ROOMS = {
    AUTHENTICATED: 'authenticated',
    ADMIN: 'admin',
    GROUPS: [
        'group0',
        'group1',
        'group2',
        'group3',
        'group4',
        'group5',
        'group6',
        'group7',
        'group8',
        'group9',
    ],
    MENTORS: [
        'mentor0',
        'mentor1',
        'mentor2',
        'mentor3',
        'mentor4',
        'mentor5',
        'mentor6',
        'mentor7',
        'mentor8',
        'mentor9',
    ],
};

export interface PayloadAuth {
    id: TeamId;
    mode: ClientType;
    pass: string;
}

export interface AuthOkPayload {
    socketId: string;
    globalState: GlobalState;
    playerState: PlayerState;
}

const userCredentialsMap: Record<string, Credentials> = {};

const authenticateSocket: SocketHandler<PayloadAuth> = async (
    socket,
    payload,
    reply
) => {
    const { id, mode, pass } = payload;
    try {
        const clientType = typeof mode === 'string' && asValidClientType(mode);
        if (clientType && typeof id === 'number' && typeof pass === 'string') {
            await auth(clientType, id, pass);
            logger.log('info', `Auth success: mode ${mode} id ${id}`);
            socket.join(ROOMS.AUTHENTICATED);
            userCredentialsMap[socket.id] = { groupNum: id, clientType };

            if (mode === 'admin') {
                socket.join(ROOMS.ADMIN);
                reply('auth_ok', {
                    socketId: socket.id,
                });
            } else if (id >= 0 && id < ROOMS.GROUPS.length) {
                socket.join(ROOMS.GROUPS[id]);
                if (mode === 'mentor') {
                    socket.join(ROOMS.MENTORS[id]);
                }
                reply('auth_ok', {
                    socketId: socket.id,
                    globalState: gameState.global,
                    playerState: gameState.players[id],
                });
            }

            socket.on('disconnect', () => {
                delete userCredentialsMap[socket.id];
            });
        } else {
            throw 'malformed_request';
        }
    } catch (e) {
        reply('error', e);
    }
};

export const getCredentials = (socketId: string): Credentials | undefined =>
    userCredentialsMap[socketId];

export default authenticateSocket;

export const notifyPlayerState = (groupNum: TeamId): void => {
    io.to(ROOMS.GROUPS[groupNum]).emit(
        'player_update',
        gameState.players[groupNum]
    );
};

export const notifyGameState = (): void => {
    io.to(ROOMS.AUTHENTICATED).emit('global_update', gameState.global);
};
