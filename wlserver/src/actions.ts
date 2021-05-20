import {
    Actions,
    GlobalState,
    PlayerState,
    Locations,
    Util,
    QuestId,
    quests,
} from 'wlcommon';

export interface ReducerResult {
    playerState: PlayerState;
    globalState: GlobalState;
    message?: string;
}

export type Reducer = (x: PlayerState, y: GlobalState) => ReducerResult;

const actionList = {
    underwater: Object.values(Actions.ALL_UNDERWATER),
    oxygen: Object.values(Actions.ALL_OXYGEN),
};

export const issueQuest = (
    playerState: PlayerState,
    questId: QuestId
): PlayerState => {
    if (playerState.quests[questId]) return;
    return {
        ...playerState,
        quests: {
            ...playerState.quests,
            [questId]: {
                id: questId,
                status: 'incomplete',
                stages: new Array(quests[questId].stages.length).fill(false),
            },
        },
    };
};

const applyAction: Reducer = (playerState, globalState) => {
    const { stagedAction, locationId } = playerState;
    if (stagedAction === null) throw 'No action staged.';

    if (actionList.underwater.includes(stagedAction))
        return applyUnderwaterAction(playerState, globalState);

    switch (locationId) {
        case Locations.locationIds.SHORES:
            return applyShoresAction(playerState, globalState);
    }

    throw `Unknown action ${stagedAction}.`;
};

const applyUnderwaterAction: Reducer = (playerState, globalState) => {
    if (!Locations.locationsMapping[playerState.locationId].undersea)
        throw 'You cannot perform this action as you are not undersea.';

    switch (playerState.stagedAction) {
        case Actions.ALL_UNDERWATER.RESURFACE:
            return {
                playerState: {
                    ...playerState,
                    oxygenUntil: null,
                    locationId: Locations.locationIds.SHORES,
                },
                globalState,
                message: 'You have resurfaced and returned to Sleepy Shores.',
            };

        case Actions.ALL_UNDERWATER.STORE_OXYGEN: {
            const { oxygenUntil, storedOxygen } = playerState;
            if (storedOxygen === null)
                throw "You cannot perform this action as you don't have an oxygen tank.";

            const oxygenToStore = Math.max(
                0,
                oxygenUntil.valueOf() - Date.now() - 2 * 60 * 1000
            );
            return {
                playerState: {
                    ...playerState,
                    oxygenUntil: new Date(
                        oxygenUntil.valueOf() - oxygenToStore
                    ),
                    storedOxygen: storedOxygen + oxygenToStore,
                },
                globalState,
                message: `You have transferred ${Util.formatDuration(
                    oxygenToStore
                )} of Oxygen to storage.`,
            };
        }

        case Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN: {
            const { oxygenUntil, storedOxygen } = playerState;
            if (storedOxygen === null)
                throw "You cannot perform this action as you don't have an oxygen tank.";

            return {
                playerState: {
                    ...playerState,
                    oxygenUntil: new Date(oxygenUntil.valueOf() + storedOxygen),
                    storedOxygen: 0,
                },
                globalState,
                message: `You have withdrawn ${Util.formatDuration(
                    storedOxygen
                )} of Oxygen from storage.`,
            };
        }
    }

    throw 'Action not implemented.';
};

const applyShoresAction: Reducer = (playerState, globalState) => {
    switch (playerState.stagedAction) {
        case Actions.SLEEPY_SHORES.DIVE: {
            return {
                playerState: {
                    ...playerState,
                    oxygenUntil: new Date(Date.now() + 20 * 60 * 1000),
                    locationId: Locations.locationIds.SHALLOWS,
                    quests: {
                        ...playerState.quests,
                    },
                },
                globalState,
                message:
                    'You have successfully dived. You are now at the Shallows.',
            };
        }
    }

    throw 'Action not implemented.';
};

export default applyAction;
