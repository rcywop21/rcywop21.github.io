import { ItemRecord, ItemId } from './items';
import { Action } from './actions';
import { QuestState } from './quests';
import { QuestId } from './quests';
import { LocationId } from './locations';
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
    linkedStreams: {
        lastSalmon?: Date;
        lastCatfish?: Date;
        lastSalmonId?: TeamId;
        lastCatfishId?: TeamId;
    }
}

export interface CrimsonAlarm {
    id: string;
    runsOutAt: Date;
    weight: number; // weight for this alarm
}

interface SurfaceState {
    oxygenUntil: null;
    pausedOxygen: -1 | null;
    challengeMode: null;
    challengePausedTime: null;
}

interface PausedState {
    oxygenUntil: null;
    pausedOxygen: number;
    challengeMode: null;
    challengePausedTime: number | null;
}

interface UnpausedState {
    oxygenUntil: Date;
    pausedOxygen: null;
    challengeMode: Date | null;
    challengePausedTime: null;
}

type TimerStates = SurfaceState | PausedState | UnpausedState;

interface BasePlayerState {
    id: TeamId;
    locationId: LocationId;
    quests: Record<QuestId, QuestState>;
    inventory: Record<ItemId, ItemRecord>;
    streamCooldownExpiry: Record<LocationId, Date>;
    storedOxygen: number | null; // number if have pump, null otherwise
    stagedAction: Action | null;
    knowsCrimson: boolean;
    knowsLanguage: boolean;
    knowsOxygen?: boolean;
    foundEngraving: boolean;
    hasMap?: boolean;
    hasBubblePass?: boolean;
    unlockedAlcove?: boolean;
    unlockedShrine?: boolean;
    unlockedWoods?: boolean;
}

export type PlayerState = BasePlayerState & TimerStates;

export interface Message {
    time: Date;
    visibility: 'all' | TeamId;
    message: string;
}
