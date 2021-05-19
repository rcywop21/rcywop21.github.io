import { GameState, Locations, PlayerState, TeamId } from 'wlcommon';
import { Reducer } from './actions';
import { notifyPlayerState } from './connections';
import logger from './logger';

export const makeStartingPlayerState = (): PlayerState => ({
    locationId: 'Shores',
    oxygenUntil: null,
    quests: {},
    inventory: {},
    streamCooldownExpiry: {},
    storedOxygen: null,
    stagedAction: null,
    knowsCrimson: false,
    knowsLanguage: false,
    foundEngraving: false,
    hasMap: false,
    unlockedAlcove: false,
    unlockedShrine: false,
    unlockedWoods: false,
});

export const gameState: GameState = {
    global: {
        artefactsFound: 0,
        tritonOxygen: {
            lastTeam: undefined,
            lastExtract: new Date(),
        },
        crimsonMasterSwitch: true,
        crimsonState: {},
        messages: [],
    },
    players: []
}

for (let i = 0; i < 10; ++i) { 
    gameState.players.push(makeStartingPlayerState());
}

export const applyReducer = (reducer: Reducer, playerId: TeamId): void => {
    const { playerState, globalState, message } = reducer(gameState.players[playerId], gameState.global);

    gameState.global = globalState;
    gameState.players[playerId] = playerState;
    gameState.players[playerId].stagedAction = null;
    if (message) {
        gameState.global.messages.push({
            time: new Date(),
            visibility: playerId,
            message
        })
    }
}

export const setAction = (playerId: TeamId, action: string | null): void => {
    if (action === null) {
        const { stagedAction } = gameState.players[playerId];
        gameState.players[playerId].stagedAction = null;
        logger.log('info', `Group ${playerId}'s action of ${stagedAction} set to null.`);
        notifyPlayerState(playerId);
    } else {
        gameState.players[playerId].stagedAction = action;
        logger.log('info', `Group ${playerId}'s action set to ${action}.`);
        notifyPlayerState(playerId);
    }
}
