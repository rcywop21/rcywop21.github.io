import { ItemRecord } from './items';

export type TeamId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Action = string;

export interface GameState {
    global: GlobalState;
}

export interface GlobalState {
    artefactsFound: number;
    tritonOxygen: {
        lastTeam: TeamId;
        lastExtract: Date;
    };
    crimsonState: CrimsonAlarm[];
}

export interface CrimsonAlarm {
    name: string;
    runsOutAt: Date;
    weight: number; // weight for this alarm
}

export interface PlayerState {
    locationId: string;
    oxygenUntil: Date | null;
    inventory: ItemRecord[];
    streamCooldownExpiry: Record<string, Date | undefined>;
    storedOxygen: number | null;
    action: Action | null;
    knowsCrimson: boolean;
    knowsLanguage: boolean;
    foundEngraving: boolean;
}

export const startingPlayerState: PlayerState = {
    locationId: 'Shores',
    oxygenUntil: null,
    inventory: [],
    storedOxygen: null,
    action: null,
    knowsCrimson: false,
    knowsLanguage: false,
    foundEngraving: false,
}
