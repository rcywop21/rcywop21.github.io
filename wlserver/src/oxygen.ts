import { Locations, Util } from 'wlcommon';
import logger from './logger';
import { makeAddMessageTransform, Transform } from './stateMgr';

export const makeAddOxygenTransform = (
    seconds: number,
    verbose = true
): Transform => (state) => {
    const { oxygenUntil, challengeMode } = state.playerState;
    if (oxygenUntil === null) return state;
    const ms = seconds * (challengeMode ? 500 : 1000);
    const duration = Util.formatDuration(ms);
    const messages = verbose
        ? [`You have received ${duration} of Oxygen.`]
        : [];
    logger.log(
        'info',
        `Player ${state.playerState.id} has received ${duration} of Oxygen.`
    );
    return makeAddMessageTransform(...messages)({
        ...state,
        playerState: {
            ...state.playerState,
            oxygenUntil: new Date(oxygenUntil.valueOf() + ms),
        },
    });
};

export const makeRemoveOxygenTransform = (
    seconds: number,
    verbose = true
): Transform => (state) => {
    const oxygenUntil = state.playerState.oxygenUntil.valueOf();
    if (oxygenUntil === null) throw 'Cannot remove oxygen when not underwater.';
    const requiredOxygenUntil = seconds * 1000 + Date.now();

    if (oxygenUntil <= requiredOxygenUntil) {
        const oxygenRemaining = requiredOxygenUntil - oxygenUntil;
        throw `Unsafe to remove ${Util.formatDuration(
            seconds * 1000
        )} seconds of Oxygen if player only has ${Util.formatDuration(
            oxygenRemaining
        )}.`;
    }

    const ms = seconds * 1000;
    const duration = Util.formatDuration(ms);
    const messages = verbose ? [`You have used ${duration} of Oxygen.`] : [];

    logger.log(
        'info',
        `Player ${state.playerState.id} has used ${duration} of Oxygen.`
    );

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

    logger.log(
        'info',
        `Player ${state.playerState.id} has started their cooldown ofthe Oxygen Stream at ${location}.`
    );

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
