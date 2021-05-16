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

export const SLEEPY_SHORES: ActionRecord = {
    DIVE: 'dive',
};

export const CORALS: ActionRecord = {
    EXPLORE: 'explore',
    LEARN_LANG: 'learn_lang',
};

export const STORE: ActionRecord = {
    BUY_MAP: 'buy_map',
    BUY_GUIDE: 'buy_guide',
    BUY_DOLL: 'buy_doll',
    BUY_DISCOVERS: 'buy_discovers',
    BUY_PUMP: 'buy_pump',
    BUY_BLACK_ROCK: 'buy_black_rock',
    BUY_BUBBLE_PASS: 'buy_bubble_pass',
};

export const STATUE: ActionRecord = {
    EXPLORE: 'explore',
    DECODE_ENGRAVING: 'decode_engraving',
    CAST_COOLING_AURA: 'cast_cooling_aura',
    STRENGTHEN_BEFUDDLEMENT: 'strengthen_befuddlement',
    POWER_CONTAINMENT: 'power_containment',
    PURIFY_CORRUPTION: 'purify_corruption',
};

export const LIBRARY: ActionRecord = {
    EXPLORE: 'explore',
    STUDY_CRIMSON: 'study_crimson',
    STUDY_ARTEFACT: 'study_artefact',
    DECODE_ARTEFACT: 'decode_artefact',
};

export const ANCHOVY_AVE: ActionRecord = {
    EXPLORE: 'explore',
    INSPIRE: 'inspire',
};

export const BARNACLE_RES: ActionRecord = {
    EXPLORE: 'explore',
    HELP: 'help',
};

export const SALMON_ST: ActionRecord = {
    EXPLORE: 'explore',
    CONFRONT: 'confront',
};

export const KELP: ActionRecord = {
    EXPLORE: 'explore',
    CLIMB_DOWN: 'climb_down',
    HARVEST: 'harvest',
};

export const SHRINE: ActionRecord = {
    GIVE_HAIR: 'give_hair',
};

export const UMBRAL: ActionRecord = {
    EXPLORE: 'explore',
    GIVE_PAN: 'give_pan',
    GIVE_ROCK: 'give_rock',
};

export const WHISPERING_WOODS: ActionRecord = {
    GET_HAIR: 'get_hair',
};

export const HIDDEN_ALCOVE: ActionRecord = {
    RETRIEVE_PEARL: 'retrieve_pearl',
};
