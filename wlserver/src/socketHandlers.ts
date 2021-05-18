import { Server, Socket as BaseSocket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Actions, Locations, TeamId } from "wlcommon";
import applyAction from "./actions";
import { getCredentials, ROOMS } from "./connections";
import logger from "./logger";
import { gameState } from "./stateMgr";

export type Socket = BaseSocket<DefaultEventsMap, DefaultEventsMap>;

export type Reply = (event: string, msg: unknown) => void;

export const STATE_UPDATE_TAG = 'state_update';

export type SocketHandler<P> = (socket: Socket, payload: P, reply: Reply, socketServer: Server) => Promise<void>;

export const notifyPlayerState = (socketServer: Server, groupNum: number): void => {
    socketServer.to(ROOMS.GROUPS[groupNum]).emit('player_update', gameState.players[groupNum]);
}

export const notifyGameState = (socketServer: Server): void => {
    socketServer.to(ROOMS.AUTHENTICATED).emit('global_update', gameState.global);
}

export const onActionHandler: SocketHandler<Actions.Action> = async (socket, payload, reply, socketServer) => {
    const credentials = getCredentials(socket.id);
    if (credentials === undefined) return reply('error', 'Not authenticated');
    if (gameState.players[credentials.groupNum].stagedAction)
        return reply('error', 'Wait for the current action to be accepted or rejected first.');

    gameState.players[credentials.groupNum].stagedAction = payload;
    logger.log('info', `Group ${credentials.groupNum} requesting approval for action ${payload}.`);
    reply('ok', 'Action staged, now waiting for action to be accepted or rejected.');
    notifyPlayerState(socketServer, credentials.groupNum);
}

export const onRejectionHandler: SocketHandler<undefined> = async (socket, _, reply, socketServer) => {
    const credentials = getCredentials(socket.id);
    if (credentials === undefined) return reply('error', 'Not authenticated');
    
    const { stagedAction } = gameState.players[credentials.groupNum];
    if (stagedAction)
        return reply('error', 'No action to reject.');

    gameState.players[credentials.groupNum].stagedAction = null;
    logger.log('info', `Group ${credentials.groupNum}'s action of ${stagedAction} was rejected.`);
    reply('ok', 'Action rejected successfully.');
    notifyPlayerState(socketServer, credentials.groupNum);
}

export const onAcceptHandler: SocketHandler<undefined> = async (socket, _, reply, socketServer) => {
    const credentials = getCredentials(socket.id);
    if (credentials === undefined) return reply('error', 'Not authenticated');

    const { stagedAction } = gameState.players[credentials.groupNum];
    if (stagedAction)
        return reply('error', 'No action to reject.');

    const { playerState, globalState, message } = applyAction(gameState.players[credentials.groupNum], gameState.global);

    gameState.global = globalState;
    gameState.players[credentials.groupNum] = playerState;

    if (message) {
        gameState.global.messages.push({
            time: new Date(),
            visibility: credentials.groupNum as TeamId,
            message
        });
    }

    logger.log('info', `Group ${credentials.groupNum}'s action of ${stagedAction} was accepted.`);
    reply('ok', 'Action accepted successfully.');
    notifyPlayerState(socketServer, credentials.groupNum);
    notifyGameState(socketServer);
}

export const onTravelHandler: SocketHandler<string> = async (socket, payload, reply, socketServer) => {
    const credentials = getCredentials(socket.id);
    if (credentials === undefined) return reply('error', 'Not authenticated');

    if (Locations.locationsMapping[payload] === undefined)
    return reply('error', 'Not a valid location.');

    const playerState = gameState.players[credentials.groupNum];
    const source = Locations.locationsMapping[playerState.locationId];
    const destination = Locations.locationsMapping[payload];

    if (source.undersea !== destination.undersea) {
        return reply('error', 'Cannot travel directly between undersea and surface locations.')
    }

    if (
        (destination.needsMap && !playerState.hasMap) ||
        (payload === Locations.locationIds.ALCOVE && !playerState.unlockedAlcove) ||
        (payload === Locations.locationIds.SHRINE && !playerState.unlockedShrine) ||
        (payload === Locations.locationIds.WOODS && !playerState.unlockedWoods)
    )
        return reply('error', 'Cannot travel to that location.')


    gameState.players[credentials.groupNum].locationId = payload;
    logger.log('info', `Group ${credentials.groupNum} has travelled to ${payload}.`);
}
