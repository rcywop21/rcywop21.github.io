import {
    GameState,
    GlobalState,
    Locations,
    PlayerState,
    QuestId,
    QuestState,
    TeamId,
} from 'wlcommon';
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
        linkedStreams: {},
    },
    players: [],
};

export const applyTransform = (
    transform: Transform,
    playerId: TeamId
): void => {
    const { playerState, globalState, messages } = transform({
        playerState: gameState.players[playerId],
        globalState: gameState.global,
        messages: [],
    });

    if (gameState.global !== globalState) {
        gameState.global = globalState;
        notifyGameState();
    }

    if (gameState.players[playerId] !== playerState) {
        gameState.players[playerId] = playerState;
        gameState.players[playerId].stagedAction = null;
        notifyPlayerState(playerId);
    }

    messages.forEach((message) =>
        gameState.global.messages.push({
            time: new Date(),
            visibility: playerId,
            message,
        })
    );

    if (messages.length) notifyNewMessages(messages.length);
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

export const makeAddMessageTransform = (...newMsg: string[]): Transform => (
    state
) => ({
    ...state,
    messages: state.messages.concat(newMsg),
});

export const killTransform: Transform = (state) => {
    const playerQuests: Record<QuestId, QuestState> = {};
    Object.entries(state.playerState.quests).forEach(
        ([questId, questState]) => {
            if (questState.status === 'completed') {
                playerQuests[questId] = questState;
            } else {
                playerQuests[questId] = {
                    ...questState,
                    stages: Array(questState.stages.length).fill(false),
                };
            }
        }
    );

    return composite(
        makeAddMessageTransform('You ran out of Oxygen and blacked out. You wake up, washed out on Sleepy Shores. You may have lost progress on parts of your adventure...'),
        makePlayerStatTransform('locationId', Locations.locationIds.SHORES),
        makePlayerStatTransform('quests', playerQuests),
        makePlayerStatTransform('oxygenUntil', null),
    )(state);
};

export const identityTransform: Transform = (x) => x;

export function makePlayerStatTransform<T extends keyof PlayerState>(
    key: T,
    value: PlayerState[T]
): Transform {
    return (state) => ({
        ...state,
        playerState: {
            ...state.playerState,
            [key]: value,
        },
    });
}

export const composite = (...transforms: Transform[]): Transform =>
    transforms.reduceRight((curr, next) => (state) => next(curr(state)));
