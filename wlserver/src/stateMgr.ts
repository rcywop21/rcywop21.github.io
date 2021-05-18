import { GameState, PlayerState } from 'wlcommon';

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

for (let i = 0; i < 10; ++i) 
    gameState.players.push(makeStartingPlayerState());
