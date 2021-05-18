import { Actions, GlobalState, PlayerState, Locations, Util } from "wlcommon";

type Reducer = (x: PlayerState, y: GlobalState) => [PlayerState, GlobalState, string];

const actionList = {
    underwater: Object.values(Actions.ALL_UNDERWATER),
    oxygen: Object.values(Actions.ALL_OXYGEN),
};

const applyAction: Reducer = (playerState, globalState) => {
    const { stagedAction } = playerState;
    if (stagedAction === null) throw 'No action staged.';

    if (actionList.underwater.includes(stagedAction))
        return applyUnderwaterAction(playerState, globalState);

    throw `Unknown action ${stagedAction}.`
}

const applyUnderwaterAction: Reducer = (playerState, globalState) => {
    if (!Locations.locationsMapping[playerState.locationId].undersea)
        throw 'Player is not undersea.'

    switch (playerState.stagedAction) {
        case Actions.ALL_UNDERWATER.RESURFACE:
            return [
                {
                    ...playerState,
                    oxygenUntil: null,
                    locationId: Locations.locationIds.SHORES,
                },
                globalState,
                'You have resurfaced and returned to Sleepy Shores.'
            ];

        case Actions.ALL_UNDERWATER.STORE_OXYGEN: {
            const { oxygenUntil, storedOxygen } = playerState;
            if (storedOxygen === null)
                throw 'Player does not have an oxygen tank.';

            const oxygenToStore = Math.max(0, oxygenUntil.valueOf() - Date.now() - 2 * 60 * 1000);
            return [
                {
                    ...playerState, 
                    oxygenUntil: new Date(oxygenUntil.valueOf() - oxygenToStore),
                    storedOxygen: storedOxygen + oxygenToStore,
                },
                globalState,
                `You have transferred ${Util.formatDuration(oxygenToStore)} of Oxygen to storage.`
            ];
        }

        case Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN: {
            const { oxygenUntil, storedOxygen } = playerState;
            if (storedOxygen === null)
                throw 'Player does not have an oxygen tank.';

            return [
                {
                    ...playerState,
                    storedOxygen: 0,
                    oxygenUntil: new Date(oxygenUntil.valueOf() + storedOxygen),
                },
                globalState,
                `You have withdrawn ${Util.formatDuration(storedOxygen)} of Oxygen from storage.`
            ]
        }
    }

    throw 'Action not implemented.'
}

export default applyAction;
