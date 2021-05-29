import {
    GameState,
    GlobalState,
    Locations,
    PlayerState,
    QuestId,
    questIds,
    QuestState,
    TeamId,
} from 'wlcommon';
import {
    notifyGameState,
    notifyNewMessages,
    notifyPlayerState,
} from './connections';
import logger from './logger';

export interface MessageSpec {
    text: string;
    visibility: 'private' | 'public';
}

export interface TransformState {
    playerState: PlayerState;
    globalState: GlobalState;
    messages: MessageSpec[];
}

export type Transform = (result: TransformState) => TransformState;

export const makeGlobalGameState = (): GlobalState => ({
    artefactsFound: 0,
    tritonOxygen: {
        lastTeam: undefined,
        lastExtract: new Date(),
    },
    crimsonMasterSwitch: true,
    crimsonState: {},
    messages: [],
    linkedStreams: {},
});

export const gameState: GameState = {
    global: makeGlobalGameState(),
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
            visibility: message.visibility === 'public' ? 'all' : playerId,
            message: message.text,
        })
    );

    if (messages.length) {
        notifyNewMessages(messages.length);
        notifyGameState();
    }
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

export const makeAddMessageTransform = (
    ...newMsg: (string | MessageSpec)[]
): Transform => (state) => ({
    ...state,
    messages: state.messages.concat(
        newMsg.map((text) => {
            if (typeof text === 'string')
                return {
                    text,
                    visibility: 'private',
                };
            else return text;
        })
    ),
});

const exemptQuests = [
    questIds.CHAPTER_2,
    questIds.CLOAK_1,
    questIds.ARTEFACTS_3,
    questIds.FINCHES_2,
    questIds.ARTEFACTS_1,
];

export const killTransform: Transform = (state) => {
    const playerQuests: Record<QuestId, QuestState> = {};
    Object.entries(state.playerState.quests).forEach(
        ([questId, questState]) => {
            if (
                questState.status === 'completed' ||
                exemptQuests.includes(parseInt(questId))
            ) {
                playerQuests[questId] = questState;
            } else {
                playerQuests[questId] = {
                    ...questState,
                    stages: Array(questState.stages.length).fill(false),
                };
            }
        }
    );

    if (state.playerState.quests[questIds.SHRINE_2]?.stages[0]) {
        playerQuests[questIds.SHRINE_2].stages[0] = true;
    }

    return composite(
        makeAddMessageTransform(
            'You ran out of Oxygen and blacked out. You wake up, washed out on Sleepy Shores. You may have lost progress on parts of your adventure...'
        ),
        makePlayerStatTransform('locationId', Locations.locationIds.SHORES),
        makePlayerStatTransform('quests', playerQuests),
        makePlayerStatTransform('oxygenUntil', null),
        makePlayerStatTransform('challengeMode', null),
        makePlayerStatTransform('stagedAction', null)
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

export const pauseTransform: Transform = (state) => {
    if (state.playerState.pausedOxygen !== null)
        throw 'Player is already paused.';

    const { oxygenUntil, challengeMode } = state.playerState;
    const now = Date.now();

    const pausedOxygen =
        oxygenUntil === null ? -1 : oxygenUntil.valueOf() - now;
    const challengePausedTime =
        challengeMode === null ? null : challengeMode.valueOf() - now;

    return {
        ...state,
        playerState: {
            ...state.playerState,
            oxygenUntil: null,
            pausedOxygen,
            challengeMode: null,
            challengePausedTime,
        },
    };
};

export const resumeTransform: Transform = (state) => {
    if (state.playerState.pausedOxygen === null) throw 'Player is not paused.';

    const { pausedOxygen, challengePausedTime } = state.playerState;
    const now = Date.now();

    const oxygenUntil =
        pausedOxygen === -1 ? null : new Date(now + pausedOxygen);
    const challengeMode =
        challengePausedTime === null
            ? null
            : new Date(now + challengePausedTime);

    return {
        ...state,
        playerState: {
            ...state.playerState,
            oxygenUntil,
            pausedOxygen: null,
            challengeMode,
            challengePausedTime: null,
        },
    };
};

export const composite = (...transforms: Transform[]): Transform =>
    transforms.reduceRight((curr, next) => (state) => next(curr(state)));
