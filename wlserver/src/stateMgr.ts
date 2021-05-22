import { GameState, GlobalState, Locations, PlayerState, QuestId, QuestState, TeamId } from 'wlcommon';
import { notifyPlayerState } from './connections';
import logger from './logger';

export interface TransformState {
    playerState: PlayerState;
    globalState: GlobalState;
    messages: string[];
}

export type Transform = (result: TransformState) => TransformState;

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
    players: [],
};

export const applyTransform = (transform: Transform, playerId: TeamId): void => {
    const { playerState, globalState, messages } = transform({
        playerState: gameState.players[playerId],
        globalState: gameState.global,
        messages: []
    });

    gameState.global = globalState;
    gameState.players[playerId] = playerState;
    gameState.players[playerId].stagedAction = null;
    messages.forEach((message) => gameState.global.messages.push({
        time: new Date(),
        visibility: playerId,
        message,
    }));
};

export const setAction = (playerId: TeamId, action: string | null): void => {
    if (action === null) {
        const { stagedAction } = gameState.players[playerId];
        gameState.players[playerId].stagedAction = null;
        logger.log(
            'info',
            `Group ${playerId}'s action of ${stagedAction} set to null.`
        );
        notifyPlayerState(playerId);
    } else {
        gameState.players[playerId].stagedAction = action;
        logger.log('info', `Group ${playerId}'s action set to ${action}.`);
        notifyPlayerState(playerId);
    }
};

export const killTransform: Transform = (state) => {
    const playerQuests: Record<QuestId, QuestState> = {};
    Object.entries(state.playerState.quests).forEach(([questId, questState]) => {
        if (questState.status === 'completed') {
            playerQuests[questId] = questState;
        } else {
            playerQuests[questId] = {
                ...questState,
                stages: Array(questState.stages.length).fill(false),
            }
        }
    });

    return {
        globalState: state.globalState,
        playerState: {
            ...state.playerState,
            locationId: Locations.locationIds.SHORES,
            oxygenUntil: null,
            quests: playerQuests,
        },
        messages: [
            ...state.messages,
            'You ran out of Oxygen and blacked out. You wake up, washed out on Sleepy Shores. You may have lost progress on parts of your adventure...'
        ]
    };
};

export const identityTransform: Transform = (x) => x;

