import { LocationId } from "./locations";
import { locationIds, locationsMapping } from "./locations";

export type Action = string;

export const ALL_UNDERWATER = {
    STORE_OXYGEN: 'store_oxygen',
    WITHDRAW_OXYGEN: 'withdraw_oxygen',
    RESURFACE: 'resurface',
};

export const ALL_OXYGEN = {
    GET_OXYGEN: 'get_oxygen',
};

export const specificActions = {
    SHORES: {
        DIVE: 'dive',
    },
    CORALS: {
        EXPLORE: 'explore',
        LEARN_LANG: 'learn_lang',
    },
    STORE: {
        BUY_MAP: 'buy_map',
        BUY_GUIDE: 'buy_guide',
        BUY_DOLL: 'buy_doll',
        BUY_DISCOVERS: 'buy_discovers',
        BUY_PUMP: 'buy_pump',
        BUY_BLACK_ROCK: 'buy_black_rock',
        BUY_BUBBLE_PASS: 'buy_bubble_pass',
    },
    STATUE: {
        EXPLORE: 'explore',
        DECODE_ENGRAVING: 'decode_engraving',
        CAST_COOLING_AURA: 'cast_cooling_aura',
        STRENGTHEN_BEFUDDLEMENT: 'strengthen_befuddlement',
        POWER_CONTAINMENT: 'power_containment',
        PURIFY_CORRUPTION: 'purify_corruption',
    },
    LIBRARY: {
        EXPLORE: 'explore',
        STUDY_CRIMSON: 'study_crimson',
        STUDY_ARTEFACT: 'study_artefact',
        DECODE_ARTEFACT: 'decode_artefact',
    },
    ANCHOVY: {
        EXPLORE: 'explore',
        INSPIRE: 'inspire',
    },
    BARNACLE: {
        EXPLORE: 'explore',
        HELP: 'help',
    },
    SALMON: {
        EXPLORE: 'explore',
        CONFRONT: 'confront',
    },
    KELP: {
        EXPLORE: 'explore',
        CLIMB_DOWN: 'climb_down',
        HARVEST: 'harvest',
    },
    SHRINE: {
        GIVE_HAIR: 'give_hair',
    },
    UMBRAL: {
        EXPLORE: 'explore',
        GIVE_PAN: 'give_pan',
        GIVE_ROCK: 'give_rock',
    },
    WOODS: {
        GET_HAIR: 'get_hair',
    }
}

const allOxygenActions = Object.values(ALL_OXYGEN);
const allUnderseaActions = Object.values(ALL_UNDERWATER);

export const actionsByLocation: Record<LocationId, Action[]> = {};
Object.entries(specificActions).forEach(([k, v]) => {
    const locationId = locationIds[k];
    actionsByLocation[locationId] = Object.values(v);
    if (locationsMapping[locationId].undersea)
        actionsByLocation[locationId].push(...allUnderseaActions);
    if (locationsMapping[locationId].oxygenStream)
        actionsByLocation[locationId].push(...allOxygenActions);
})
