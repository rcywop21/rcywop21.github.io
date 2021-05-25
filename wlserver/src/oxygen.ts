import { Locations, Util } from 'wlcommon';
import logger from './logger';
import { makeAddMessageTransform, makePlayerStatTransform, Transform } from './stateMgr';

export const makeAddOxygenTransform = (
    seconds: number,
    verbose = true
): Transform => (state) => {
    const { oxygenUntil, challengeMode, pausedOxygen } = state.playerState;
    if (pausedOxygen !== null || pausedOxygen === -1)
        throw 'You cannot perform this action while paused.';
    if (oxygenUntil === null)
        return state;

    const ms = seconds * (challengeMode ? 500 : 1000);
    const duration = Util.formatDuration(ms);
    logger.log(
        'info',
        `Player ${state.playerState.id} has received ${duration} of Oxygen.`
    );

    let result = makePlayerStatTransform('oxygenUntil', new Date(oxygenUntil.valueOf() + ms))(state)
    if (verbose)
        result = makeAddMessageTransform(`You have received ${duration} of Oxygen.`)(result);

    return result;
};

export const makeRemoveOxygenTransform = (
    seconds: number,
    verbose = true
): Transform => (state) => {
    const oxygenUntil = state.playerState.oxygenUntil?.valueOf();
    const pausedOxygen = state.playerState.pausedOxygen;

    if (pausedOxygen !== null || pausedOxygen === -1)
        throw 'You cannot perform this action while paused.';
    if (oxygenUntil === null)
        throw 'Cannot remove oxygen when not underwater.';

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

    logger.log(
        'info',
        `Player ${state.playerState.id} has used ${duration} of Oxygen.`
    );

    let result = makePlayerStatTransform('oxygenUntil', new Date(oxygenUntil - ms))(state);
    if (verbose)
        result = makeAddMessageTransform(`You have used ${duration} of Oxygen.`)(result);

    return result;
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
