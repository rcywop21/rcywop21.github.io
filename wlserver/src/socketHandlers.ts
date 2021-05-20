import { Server, Socket as BaseSocket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Actions, Locations, TeamId } from 'wlcommon';
import applyAction from './actions';
import {
    getCredentials,
    notifyPlayerState,
    notifyGameState,
} from './connections';
import logger from './logger';
import { applyReducer, gameState, setAction } from './stateMgr';

export type Socket = BaseSocket<DefaultEventsMap, DefaultEventsMap>;

export type Reply = (event: string, msg: unknown) => void;

export const STATE_UPDATE_TAG = 'state_update';

export type SocketHandler<P> = (
    socket: Socket,
    payload: P,
    reply: Reply,
    socketServer: Server
) => Promise<void>;

export const onActionHandler: SocketHandler<Actions.Action> = async (
    socket,
    payload,
    reply
) => {
    const credentials = getCredentials(socket.id);
    if (credentials === undefined) return reply('error', 'Not authenticated');
    if (gameState.players[credentials.groupNum].stagedAction)
        return reply(
            'error',
            'Wait for the current action to be accepted or rejected first.'
        );

    setAction(credentials.groupNum, payload);
};

export const onRejectionHandler: SocketHandler<undefined> = async (
    socket,
    _,
    reply
) => {
    const credentials = getCredentials(socket.id);
    if (credentials === undefined) return reply('error', 'Not authenticated');

    const { stagedAction } = gameState.players[credentials.groupNum];
    if (stagedAction) return reply('error', 'No action to reject.');
    setAction(credentials.groupNum as TeamId, null);
};

export const onAcceptHandler: SocketHandler<undefined> = async (
    socket,
    _,
    reply
) => {
    const credentials = getCredentials(socket.id);
    if (credentials === undefined) return reply('error', 'Not authenticated');

    const { stagedAction } = gameState.players[credentials.groupNum];
    if (stagedAction) return reply('error', 'No action to reject.');

    applyReducer(applyAction, credentials.groupNum as TeamId);

    logger.log(
        'info',
        `Group ${credentials.groupNum}'s action of ${stagedAction} was accepted.`
    );
    reply('ok', 'Action accepted successfully.');
    notifyPlayerState(credentials.groupNum);
    notifyGameState();
};

export const onTravelHandler: SocketHandler<string> = async (
    socket,
    payload,
    reply
) => {
    const credentials = getCredentials(socket.id);
    if (credentials === undefined) return reply('error', 'Not authenticated');

    if (Locations.locationsMapping[payload] === undefined)
        return reply('error', 'Not a valid location.');

    const playerState = gameState.players[credentials.groupNum];
    const source = Locations.locationsMapping[playerState.locationId];
    const destination = Locations.locationsMapping[payload];

    if (source.undersea !== destination.undersea) {
        return reply(
            'error',
            'Cannot travel directly between undersea and surface locations.'
        );
    }

    if (
        (destination.needsMap && !playerState.hasMap) ||
        (payload === Locations.locationIds.ALCOVE &&
            !playerState.unlockedAlcove) ||
        (payload === Locations.locationIds.SHRINE &&
            !playerState.unlockedShrine) ||
        (payload === Locations.locationIds.WOODS && !playerState.unlockedWoods)
    )
        return reply('error', 'Cannot travel to that location.');

    gameState.players[credentials.groupNum].locationId = payload;
    logger.log(
        'info',
        `Group ${credentials.groupNum} has travelled to ${payload}.`
    );

    notifyPlayerState(credentials.groupNum);
};
