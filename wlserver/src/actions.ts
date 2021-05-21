import {
    Actions,
    Locations,
    Util,
    QuestId,
    quests,
    questIds,
} from 'wlcommon';
import { locationIds } from 'wlcommon/build/locations';
import { makePostCompletionTransform } from './questRewards';
import { Transform } from './stateMgr';

const actionList = {
    underwater: Object.values(Actions.ALL_UNDERWATER),
    oxygen: Object.values(Actions.ALL_OXYGEN),
};

export const makeIssueQuestTransform = (questId: QuestId): Transform => (state) => {
    if (state.playerState.quests[questId]) return;
    const questDetails = quests[questId];
    if (questDetails === undefined) throw `Unknown quest ID ${questId}`;
    return { 
        ...state,
        playerState: {
            ...state.playerState,
            quests: {
                ...state.playerState.quests,
                [questId]: {
                    id: questId,
                    status: 'incomplete',
                    stages: new Array(questDetails.stages.length).fill(false),
                },
            },
        },
        messages: [
            ...state.messages, 
            `You have received a new quest - ${quests[questId].name}. Check your Quest Log for more information.`
        ]
    };
}

export const makeAdvanceQuestTransform = (questId: QuestId, stage: number): Transform => (state) => {
    const questState = { ...state.playerState.quests[questId] };
    questState.stages = [...questState.stages];

    // quest validation
    if (questState === undefined) throw `Player does not have quest with quest ID ${questId} active.`

    if (questState.stages[stage]) return state;

    // stage validation
    if (quests[questId].stageOrder === 'inOrder' && stage > 0 && !questState.stages[stage - 1])
        throw `Player has not completed stage ${stage - 1} required for 'inOrder' quest with ID ${questId}.`

    // set stage true
    questState.stages[stage] = true;

    if (questState.stages.every((x) => x)) 
        questState.status = 'completed';

    let result = {
        ...state,
        playerState: {
            ...state.playerState,
            quests: { ...state.playerState.quests, [questId]: questState },
        },
    };

    // quest is completed
    if (questState.status === 'completed') { 
        result = makePostCompletionTransform(questId)(result);
    }

    return result;
}

const applyAction: Transform = (state) => {
    if (state.playerState.stagedAction === null) throw 'No action staged.';

    if (actionList.underwater.includes(state.playerState.stagedAction))
        return applyUnderwaterAction(state);

    switch (state.playerState.locationId) {
        case Locations.locationIds.SHORES:
            return applyShoresAction(state);
    }

    throw `Unknown or invalid action ${state.playerState.stagedAction}.`;
};

const applyUnderwaterAction: Transform = (state) => {
    if (!Locations.locationsMapping[state.playerState.locationId].undersea)
        throw 'You cannot perform this action as you are not undersea.';

    switch (state.playerState.stagedAction) {
        case Actions.ALL_UNDERWATER.RESURFACE:
            return {
                ...state,
                playerState: {
                    ...state.playerState,
                    oxygenUntil: null,
                    locationId: Locations.locationIds.SHORES,
                },
                messages: [
                    ...state.messages, 
                    'You have resurfaced and returned to Sleepy Shores.'
                ],
            };

        case Actions.ALL_UNDERWATER.STORE_OXYGEN: {
            const { oxygenUntil, storedOxygen } = state.playerState;
            if (storedOxygen === null)
                throw "You cannot perform this action as you don't have an oxygen tank.";

            const oxygenToStore = Math.max(
                0,
                oxygenUntil.valueOf() - Date.now() - 2 * 60 * 1000
            );
            return {
                ...state,
                playerState: {
                    ...state.playerState,
                    oxygenUntil: new Date(
                        oxygenUntil.valueOf() - oxygenToStore
                    ),
                    storedOxygen: storedOxygen + oxygenToStore,
                },
                messages: [
                    ...state.messages,
                    `You have transferred ${Util.formatDuration(oxygenToStore)} of Oxygen to storage.`
                ],
            };
        }

        case Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN: {
            const { oxygenUntil, storedOxygen } = state.playerState;
            if (storedOxygen === null)
                throw "You cannot perform this action as you don't have an oxygen tank.";

            return {
                ...state,
                playerState: {
                    ...state.playerState,
                    oxygenUntil: new Date(oxygenUntil.valueOf() + storedOxygen),
                    storedOxygen: 0,
                },
                messages: [
                    ...state.messages,
                    `You have withdrawn ${Util.formatDuration(storedOxygen)} of Oxygen from storage.`
                ],
            };
        }
    }

    throw 'Action not implemented.';
};

const applyShoresAction: Transform = (state) => {
    switch (state.playerState.stagedAction) {
        case Actions.specificActions[locationIds.SHORES].DIVE: {
            return makeAdvanceQuestTransform(questIds.CHAPTER_1, 0)({
                ...state,
                playerState: {
                    ...state.playerState,
                    oxygenUntil: new Date(Date.now() + 20 * 60 * 1000),
                    locationId: Locations.locationIds.SHALLOWS,
                },
                messages: [
                    ...state.messages, 
                    'You dive into the deep blue sea... and arrive at the Shallows!'
                ],
            });
        }
    }

    throw 'Action not implemented.';
};

const applyCoralsAction: Transform = (state) => {
    switch (state.playerState.stagedAction) {
        case Actions.specificActions[locationIds.CORALS].EXPLORE:
            break;
    }
}

export default applyAction;
