import { LocationId } from "wlcommon";
import { locationIds, locationsMapping } from "./locations";

export type Action = string;

type ActionRecord = Record<string, Action>;

export const ALL_UNDERWATER: ActionRecord = {
    STORE_OXYGEN: 'store_oxygen',
    WITHDRAW_OXYGEN: 'withdraw_oxygen',
    RESURFACE: 'resurface',
};

export const ALL_OXYGEN: ActionRecord = {
    GET_OXYGEN: 'get_oxygen',
};

export const specificActions: Record<LocationId, Record<Action, string>> = {
    [locationIds.SHORES]: {
        DIVE: 'dive',
    },
    [locationIds.CORALS]: {
        EXPLORE: 'explore',
        LEARN_LANG: 'learn_lang',
    },
    [locationIds.STORE]: {
        BUY_MAP: 'buy_map',
        BUY_GUIDE: 'buy_guide',
        BUY_DOLL: 'buy_doll',
        BUY_DISCOVERS: 'buy_discovers',
        BUY_PUMP: 'buy_pump',
        BUY_BLACK_ROCK: 'buy_black_rock',
        BUY_BUBBLE_PASS: 'buy_bubble_pass',
    },
    [locationIds.STATUE]: {
        EXPLORE: 'explore',
        DECODE_ENGRAVING: 'decode_engraving',
        CAST_COOLING_AURA: 'cast_cooling_aura',
        STRENGTHEN_BEFUDDLEMENT: 'strengthen_befuddlement',
        POWER_CONTAINMENT: 'power_containment',
        PURIFY_CORRUPTION: 'purify_corruption',
    },
    [locationIds.LIBRARY]: {
        EXPLORE: 'explore',
        STUDY_CRIMSON: 'study_crimson',
        STUDY_ARTEFACT: 'study_artefact',
        DECODE_ARTEFACT: 'decode_artefact',
    },
    [locationIds.ANCHOVY]: {
        EXPLORE: 'explore',
        INSPIRE: 'inspire',
    },
    [locationIds.BARNACLE]: {
        EXPLORE: 'explore',
        HELP: 'help',
    },
    [locationIds.SALMON]: {
        EXPLORE: 'explore',
        CONFRONT: 'confront',
    },
    [locationIds.KELP]: {
        EXPLORE: 'explore',
        CLIMB_DOWN: 'climb_down',
        HARVEST: 'harvest',
    },
    [locationIds.SHRINE]: {
        GIVE_HAIR: 'give_hair',
    },
    [locationIds.UMBRAL]: {
        EXPLORE: 'explore',
        GIVE_PAN: 'give_pan',
        GIVE_ROCK: 'give_rock',
    },
    [locationIds.WOODS]: {
        GET_HAIR: 'get_hair',
    }
}

const allOxygenActions = Object.values(ALL_OXYGEN);
const allUnderseaActions = Object.values(ALL_UNDERWATER);

export const actionsByLocation: Record<LocationId, Action[]> = {};
Object.entries(specificActions).forEach(([k, v]) => {
    actionsByLocation[k] = Object.values(v);
    if (locationsMapping[k].undersea)
        actionsByLocation[k].push(...allUnderseaActions);
    if (locationsMapping[k].oxygenStream)
        actionsByLocation[k].push(...allOxygenActions);
})
