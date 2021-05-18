import { ItemRecord, ItemId } from './items';
import { Action } from './actions';
import { QuestState } from 'wlcommon';
import { QuestId } from './quests';
export { Action };

export type TeamId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface GameState {
    global: GlobalState;
    players: PlayerState[];
}

export interface GlobalState {
    artefactsFound: number;
    tritonOxygen: {
        lastTeam?: TeamId;
        lastExtract: Date;
    };
    crimsonMasterSwitch: boolean;
    crimsonState: Record<string, CrimsonAlarm>;
    messages: Message[];
}

export interface CrimsonAlarm {
    id: string;
    runsOutAt: Date;
    weight: number; // weight for this alarm
}

export interface PlayerState {
    locationId: string;
    oxygenUntil: Date | null;
    quests: Record<QuestId, QuestState>;
    inventory: Record<ItemId, ItemRecord>;
    streamCooldownExpiry: Record<string, Date | undefined>;
    storedOxygen: number | null;
    stagedAction: Action | null;
    knowsCrimson: boolean;
    knowsLanguage: boolean;
    foundEngraving: boolean;
    hasMap: boolean;
    unlockedAlcove: boolean;
    unlockedShrine: boolean;
    unlockedWoods: boolean;
}

export interface Message {
    time: Date;
    visibility: 'all' | TeamId;
    message: string;
}
