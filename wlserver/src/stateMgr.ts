import { GameState, PlayerState } from 'wlcommon';

export const makeStartingPlayerState = (): PlayerState => ({
    locationId: 'Shores',
    oxygenUntil: null,
    inventory: [],
    storedOxygen: null,
    stagedAction: null,
    knowsCrimson: false,
    knowsLanguage: false,
    foundEngraving: false,
    streamCooldownExpiry: {},
});

export const gameState: GameState = {
    global: {
        artefactsFound: 0,
        tritonOxygen: {
            lastTeam: undefined,
            lastExtract: new Date(),
        },
        crimsonMasterSwitch: true,
        crimsonState: {}
    },
    players: []
}

for (let i = 0; i < 10; ++i) 
    gameState.players.push(makeStartingPlayerState());
