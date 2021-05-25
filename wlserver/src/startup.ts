import { existsSync } from 'fs';
import { FileHandle, open } from 'fs/promises';
import { CrimsonAlarm, GameState, PlayerState, questIds, TeamId } from 'wlcommon';
import { makeIssueQuestTransform } from './questRewards';
import { applyTransform, gameState, makeGlobalGameState } from './stateMgr';

const SAVE_FILE = process.env.SAVE_FILE || 'save.json';

const makeStartingPlayerState = (id: TeamId): PlayerState => ({
    id,
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
    pausedOxygen: null,
    challengeMode: null,
    challengePausedTime: null,
});

export const setupFreshGameState = (): void => {
    gameState.global = makeGlobalGameState();

    for (let i = 0; i <= 10; ++i) {
        gameState.players.push(makeStartingPlayerState(i as TeamId));
        applyTransform(
            makeIssueQuestTransform(questIds.CHAPTER_1),
            i as TeamId
        );
    }
};

export const saveGameState = async (): Promise<void> => {
    let fileHandle: FileHandle;

    try {
        fileHandle = await open(SAVE_FILE, 'w');
        fileHandle.writeFile(JSON.stringify(gameState));
    } finally {
        await fileHandle?.close();
    }
}

export const loadGameState = async (): Promise<void> => {
    let fileHandle: FileHandle;
    try {
        fileHandle = await open(SAVE_FILE, 'r');
        const state = JSON.parse(await fileHandle.readFile({ encoding: 'utf-8' })) as GameState;
        state.global.tritonOxygen.lastExtract = new Date(state.global.tritonOxygen.lastExtract);

        const { lastSalmon, lastCatfish } = state.global.linkedStreams;
        if (lastSalmon)
            state.global.linkedStreams.lastSalmon = new Date(lastSalmon);
        if (lastCatfish)
            state.global.linkedStreams.lastCatfish = new Date(lastCatfish);

        Object.entries(state.global.crimsonState).forEach(([id, alarm]) => {
            state.global.crimsonState[id].runsOutAt = new Date(alarm.runsOutAt);
        });

        for (let i = 0; i < state.players.length; ++i) {
            Object.entries(state.players[i].streamCooldownExpiry).forEach(([locationId, time]) => state.players[i].streamCooldownExpiry[locationId] = time);
            
            if (state.players[i].oxygenUntil !== null)
                state.players[i].oxygenUntil = new Date(state.players[i].oxygenUntil);

            if (state.players[i].challengeMode !== null)
                state.players[i].challengeMode = new Date(state.players[i].challengeMode);
        }

        gameState.global = state.global;
        gameState.players = state.players;
    } finally {
        fileHandle?.close();
    }
}

export const setupGameState = (): void => {
    try {
        if (existsSync(SAVE_FILE)) {
            loadGameState();
        } else {
            setupFreshGameState();
        }
    } catch {
        setupFreshGameState();
    }
}

export default setupGameState;
