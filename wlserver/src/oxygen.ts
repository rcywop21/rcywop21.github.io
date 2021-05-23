import { Locations, Util } from 'wlcommon';
import { makeAddMessageTransform, Transform } from './stateMgr';

export const makeAddOxygenTransform = (seconds: number, verbose = true): Transform => (
    state
) => {
    const { oxygenUntil } = state.playerState;
    if (oxygenUntil === null) return state;
    const ms = seconds * 1000;
    const messages = verbose ? [`You have received ${Util.formatDuration(ms)} of Oxygen.`] : [];
    return makeAddMessageTransform(...messages)({
        ...state,
        playerState: {
            ...state.playerState,
            oxygenUntil: new Date(oxygenUntil.valueOf() + ms),
        },
    });
};

export const makeRemoveOxygenTransform = (seconds: number, verbose = true): Transform => (
    state
) => {
    const oxygenUntil = state.playerState.oxygenUntil.valueOf();
    if (oxygenUntil === null) throw 'Cannot remove oxygen when not underwater.';
    const requiredOxygenUntil = (seconds + 15) * 1000 + Date.now();

    if (oxygenUntil <= requiredOxygenUntil) {
        const oxygenRemaining = requiredOxygenUntil - oxygenUntil;
        throw `Unsafe to remove ${Util.formatDuration(
            seconds * 1000
        )} seconds of Oxygen if player only has ${Util.formatDuration(
            oxygenRemaining
        )}.`;
    }

    const ms = seconds * 1000;

    const messages = verbose ? [`You have used ${Util.formatDuration(ms)} for Oxygen.`] : [];

    return makeAddMessageTransform(...messages)({
        ...state,
        playerState: {
            ...state.playerState,
            oxygenUntil: new Date(oxygenUntil - seconds * 1000),
        },
    });
};

export const updateStreamCooldownTransform: Transform = (state) => {
    const location = state.playerState.locationId;
    if (Locations.locationsMapping[location]?.oxygenStream === undefined)
        throw 'This location does not have an oxygen stream.';

    const expiry = state.playerState.streamCooldownExpiry[location]?.valueOf();
    if (expiry !== undefined && expiry.valueOf() > Date.now())
        throw 'This oxygen stream is still on cooldown, please wait.';

    return {
        ...state,
        playerState: {
            ...state.playerState,
            streamCooldownExpiry: {
                ...state.playerState.streamCooldownExpiry,
                [location]: new Date(Date.now() + 5 * 60 * 1000),
            },
        },
    };
};
