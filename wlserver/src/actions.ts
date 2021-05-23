import {
    Actions,
    Locations,
    Util,
    QuestId,
    quests,
    questIds,
    itemDetails,
} from 'wlcommon';
import { makeAddItemTransform } from './inventory';
import {
    makeAddOxygenTransform,
    makeRemoveOxygenTransform,
    updateStreamCooldownTransform,
} from './oxygen';
import { makePostCompletionTransform } from './questRewards';
import {
    identityTransform,
    makeAddMessageTransform,
    Transform,
} from './stateMgr';

const actionList = {
    underwater: Object.values(Actions.ALL_UNDERWATER),
    oxygen: Object.values(Actions.ALL_OXYGEN),
};

export const makeIssueQuestTransform = (questId: QuestId): Transform => (
    state
) => {
    if (state.playerState.quests[questId]) return;
    const questDetails = quests[questId];
    if (questDetails === undefined) throw `Unknown quest ID ${questId}`;
    return makeAddMessageTransform(
        `You have received a new quest - ${quests[questId].name}. Check your Quest Log for more information.`
    )({
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
    });
};

export const makeAdvanceQuestTransform = (
    questId: QuestId,
    stage: number,
    admin = false
): Transform => (state) => {
    const questState = { ...state.playerState.quests[questId] };
    questState.stages = [...questState.stages];

    // quest validation
    if (questState === undefined) {
        if (admin)
            throw `Player does not have quest with quest ID ${questId} active.`;
        else return state;
    }

    if (questState.stages[stage]) return state;

    // stage validation
    if (
        quests[questId].stageOrder === 'inOrder' &&
        stage > 0 &&
        !questState.stages[stage - 1]
    ) {
        if (admin)
            throw `Player has not completed stage ${
                stage - 1
            } required for 'inOrder' quest with ID ${questId}.`;
        else return state;
    }

    // set stage true
    questState.stages[stage] = true;

    if (questState.stages.every((x) => x)) questState.status = 'completed';

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
};

const applyAction: Transform = (state) => {
    if (state.playerState.stagedAction === null) throw 'No action staged.';

    if (actionList.underwater.includes(state.playerState.stagedAction))
        return applyUnderwaterAction(state);

    const locationAction = applyLocationActions[state.playerState.locationId];
    if (Locations.locationIds !== undefined) return locationAction(state);

    throw `Unknown or invalid action ${state.playerState.stagedAction}.`;
};

const applyLocationActions: Record<Locations.LocationId, Transform> = {
    [Locations.locationIds.SHORES]: (state) => {
        switch (state.playerState.stagedAction) {
            case Actions.specificActions.SHORES.DIVE: {
                return makeAddMessageTransform(
                    'You dive into the deep blue sea... and arrive at the Shallows!'
                )(
                    makeAdvanceQuestTransform(
                        questIds.CHAPTER_1,
                        0
                    )({
                        ...state,
                        playerState: {
                            ...state.playerState,
                            oxygenUntil: new Date(Date.now() + 20 * 60 * 1000),
                            locationId: Locations.locationIds.SHALLOWS,
                        },
                    })
                );
            }
        }

        throw 'Action not implemented.';
    },
    [Locations.locationIds.CORALS]: (state) => {
        switch (state.playerState.stagedAction) {
            case Actions.specificActions.CORALS.EXPLORE:
                return makeIssueQuestTransform(questIds.FINCHES)(
                    makeRemoveOxygenTransform(300)(state)
                );
            case Actions.specificActions.CORALS.LEARN_LANG: {
                return (state.playerState.foundEngraving
                    ? makeAdvanceQuestTransform(questIds.FINCHES, 1)
                    : identityTransform)(
                    makeAdvanceQuestTransform(
                        questIds.FINCHES,
                        0
                    )(
                        makeAddMessageTransform(
                            'After some hard work and effort, you are now able to understand the ancient language.'
                        )({
                            ...state,
                            playerState: {
                                ...state.playerState,
                                knowsLanguage: true,
                            },
                        })
                    )
                );
            }
            case Actions.ALL_OXYGEN.GET_OXYGEN:
                return makeAdvanceQuestTransform(
                    questIds.CHAPTER_1,
                    1
                )(
                    makeAddOxygenTransform(1200)(
                        updateStreamCooldownTransform(state)
                    )
                );
        }

        throw 'Action not implemented.';
    },
    [Locations.locationIds.STORE]: (state) => {
        switch (state.playerState.stagedAction) {
            case Actions.specificActions.STORE.BUY_MAP:
                return makeAddItemTransform(
                    itemDetails.MAP.id,
                    1
                )(
                    makeAdvanceQuestTransform(
                        questIds.CHAPTER_1,
                        2
                    )(
                        makeRemoveOxygenTransform(300)({
                            ...state,
                            playerState: {
                                ...state.playerState,
                                hasMap: true,
                            },
                        })
                    )
                );
            case Actions.specificActions.STORE.BUY_DOLL:
                return makeAddItemTransform(
                    itemDetails.MERMAID_DOLL.id,
                    1
                )(makeRemoveOxygenTransform(600)(state));
            case Actions.specificActions.STORE.BUY_GUIDE:
                return makeAddItemTransform(
                    itemDetails.OXYGEN_GUIDE.id,
                    1
                )(
                    makeRemoveOxygenTransform(300)({
                        ...state,
                        playerState: {
                            ...state.playerState,
                            knowsOxygen: true,
                        },
                    })
                );
            case Actions.specificActions.STORE.BUY_BUBBLE_PASS:
                return makeAddItemTransform(
                    itemDetails.BUBBLE.id,
                    1
                )(
                    makeRemoveOxygenTransform(2400)({
                        ...state,
                        playerState: {
                            ...state.playerState,
                            hasBubblePass: true,
                        },
                    })
                );
            case Actions.specificActions.STORE.BUY_PUMP:
                return makeAddItemTransform(
                    itemDetails.PUMP.id,
                    1
                )(
                    makeRemoveOxygenTransform(1800)({
                        ...state,
                        playerState: {
                            ...state.playerState,
                            storedOxygen: state.playerState.storedOxygen ?? 0,
                        },
                    })
                );
            case Actions.specificActions.STORE.BUY_BLACK_ROCK:
                return makeAddItemTransform(
                    itemDetails.BLACK_ROCK.id,
                    1
                )(
                    makeAdvanceQuestTransform(
                        questIds.CLOAK_2,
                        0
                    )(makeRemoveOxygenTransform(1800)(state))
                );
            case Actions.specificActions.STORE.BUY_DISCOVERS:
                return makeAddItemTransform(
                    itemDetails.DISCOVERS.id,
                    1
                )(
                    makeAdvanceQuestTransform(
                        questIds.ARTEFACTS_3,
                        0
                    )(makeRemoveOxygenTransform(1800)(state))
                );
        }

        throw 'Action not implemented.';
    },
    [Locations.locationIds.STATUE]: (state) => {
        switch (state.playerState.stagedAction) {
            case Actions.specificActions.STATUE.EXPLORE:
                return makeAdvanceQuestTransform(
                    questIds.FINCHES,
                    1
                )(
                    makeRemoveOxygenTransform(300)(
                        makeAddMessageTransform(
                            'You find a mysterious engraving at the base of the statue. It seems to be written in some sort of ancient language...'
                        )({
                            ...state,
                            playerState: {
                                ...state.playerState,
                                foundEngraving: true,
                            },
                        })
                    )
                );

            case Actions.specificActions.STATUE.DECODE_ENGRAVING: {
                if (
                    state.playerState.foundEngraving &&
                    state.playerState.knowsLanguage
                ) {
                    return makeAdvanceQuestTransform(
                        questIds.FINCHES,
                        2
                    )(
                        makeAddMessageTransform(
                            'You have decoded the engraving.'
                        )(state)
                    );
                }
                throw 'Requirements not met.';
            }
        }
    },
};

const applyUnderwaterAction: Transform = (state) => {
    if (!Locations.locationsMapping[state.playerState.locationId].undersea)
        throw 'You cannot perform this action as you are not undersea.';

    switch (state.playerState.stagedAction) {
        case Actions.ALL_UNDERWATER.RESURFACE:
            return makeAddMessageTransform(
                'You have resurfaced and returned to Sleepy Shores.'
            )({
                ...state,
                playerState: {
                    ...state.playerState,
                    oxygenUntil: null,
                    locationId: Locations.locationIds.SHORES,
                },
            });

        case Actions.ALL_UNDERWATER.STORE_OXYGEN: {
            const { oxygenUntil, storedOxygen } = state.playerState;
            if (storedOxygen === null)
                throw "You cannot perform this action as you don't have an oxygen tank.";

            const oxygenToStore = Math.max(
                0,
                oxygenUntil.valueOf() - Date.now() - 2 * 60 * 1000
            );
            return makeAddMessageTransform(
                `You have transferred ${Util.formatDuration(
                    oxygenToStore
                )} of Oxygen to storage.`
            )({
                ...state,
                playerState: {
                    ...state.playerState,
                    oxygenUntil: new Date(
                        oxygenUntil.valueOf() - oxygenToStore
                    ),
                    storedOxygen: storedOxygen + oxygenToStore,
                },
            });
        }

        case Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN: {
            const { oxygenUntil, storedOxygen } = state.playerState;
            if (storedOxygen === null)
                throw "You cannot perform this action as you don't have an oxygen tank.";

            return makeAddMessageTransform(
                `You have withdrawn ${Util.formatDuration(
                    storedOxygen
                )} of Oxygen from storage.`
            )({
                ...state,
                playerState: {
                    ...state.playerState,
                    oxygenUntil: new Date(oxygenUntil.valueOf() + storedOxygen),
                    storedOxygen: 0,
                },
            });
        }
    }

    throw 'Action not implemented.';
};

export default applyAction;
