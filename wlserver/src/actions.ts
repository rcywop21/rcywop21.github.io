import {
    Actions,
    Locations,
    Util,
    QuestId,
    quests,
    questIds,
    itemDetails,
    Action,
} from 'wlcommon';
import { makeAddItemTransform } from './inventory';
import logger from './logger';
import {
    makeAddOxygenTransform,
    makeRemoveOxygenTransform,
    updateStreamCooldownTransform,
} from './oxygen';
import { makePostCompletionTransform } from './questRewards';
import {
    composite,
    makeAddMessageTransform,
    makePlayerStatTransform,
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
    return composite(
        makeAddMessageTransform(
            `You have received a new quest - ${quests[questId].name}. Check your Quest Log for more information.`
        ),
        makePlayerStatTransform('quests', {
            ...state.playerState.quests,
            [questId]: {
                id: questId,
                status: 'incomplete',
                stages: new Array(questDetails.stages.length).fill(false),
            },
        })
    )(state);
};

export const makeAdvanceQuestTransform = (
    questId: QuestId,
    stage: number,
    admin = false
): Transform => (state) => {
    // quest validation
    if (!state.playerState.quests[questId]) {
        if (admin)
            throw `Player does not have quest with quest ID ${questId} active.`;
        else return state;
    }

    const questState = { ...state.playerState.quests[questId] };
    questState.stages = [...questState.stages];

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

    let result = makePlayerStatTransform('quests', {
        ...state.playerState.quests,
        [questId]: questState,
    })(state);

    // quest is completed
    if (questState.status === 'completed') {
        result = makePostCompletionTransform(questId)(result);
    }

    return result;
};

const applyAction: Transform = (state) => {
    if (!state.playerState.stagedAction) throw 'No action staged.';

    if (actionList.underwater.includes(state.playerState.stagedAction))
        return applyUnderwaterAction(state);

    const locationAction = applyLocationActions[state.playerState.locationId];
    if (locationAction === undefined) {
        throw `Actions for ${state.playerState.locationId} have not been implemented yet.`;
    }

    const specificActions = locationAction[state.playerState.stagedAction];
    if (locationAction === undefined) {
        throw `Unknown or invalid action ${state.playerState.stagedAction}.`;
    }

    return specificActions(state);
};

const applyLocationActions: Record<
    Locations.LocationId,
    Record<Action, Transform>
> = {
    [Locations.locationIds.SHORES]: {
        [Actions.specificActions.SHORES.DIVE]: composite(
            makeAdvanceQuestTransform(questIds.CHAPTER_1, 0),
            makeAddMessageTransform(
                'You dive into the deep blue sea... and arrive at the Shallows!'
            ),
            makePlayerStatTransform(
                'oxygenUntil',
                new Date(Date.now() + 20 * 60 * 1000)
            ),
            makePlayerStatTransform(
                'locationId',
                Locations.locationIds.SHALLOWS
            )
        ),
    },
    [Locations.locationIds.CORALS]: {
        [Actions.specificActions.CORALS.EXPLORE]: composite(
            makeIssueQuestTransform(questIds.FINCHES),
            makeRemoveOxygenTransform(300)
        ),
        [Actions.specificActions.CORALS.LEARN_LANG]: (state) => {
            return composite(
                ...(state.playerState.foundEngraving
                    ? [makeAdvanceQuestTransform(questIds.FINCHES, 1)]
                    : []),
                makeAdvanceQuestTransform(questIds.ARTEFACTS_2, 0),
                makeAdvanceQuestTransform(questIds.FINCHES, 0),
                makePlayerStatTransform('knowsLanguage', true),
                makeAddMessageTransform(
                    'After some hard work and effort, you are now able to understand the ancient language.'
                )
            )(state);
        },
        [Actions.ALL_OXYGEN.GET_OXYGEN]: composite(
            makeAdvanceQuestTransform(questIds.CHAPTER_1, 1),
            makeAddOxygenTransform(1200),
            updateStreamCooldownTransform
        ),
    },
    [Locations.locationIds.STORE]: {
        [Actions.specificActions.STORE.BUY_MAP]: composite(
            makeAdvanceQuestTransform(questIds.CHAPTER_1, 2),
            makePlayerStatTransform('hasMap', true),
            makeAddItemTransform(itemDetails.MAP.id, 1),
            makeRemoveOxygenTransform(300)
        ),
        [Actions.specificActions.STORE.BUY_GUIDE]: composite(
            makeAddMessageTransform(
                'You have added knowledge about the Oxygen Streams of the Undersea to your Journal.'
            ),
            makePlayerStatTransform('knowsOxygen', true),
            makeAddItemTransform(itemDetails.OXYGEN_GUIDE.id, 1),
            makeRemoveOxygenTransform(300)
        ),
        [Actions.specificActions.STORE.BUY_DOLL]: composite(
            makeAddItemTransform(itemDetails.MERMAID_DOLL.id, 1),
            makeRemoveOxygenTransform(600)
        ),
        [Actions.specificActions.STORE.BUY_DISCOVERS]: composite(
            makeAdvanceQuestTransform(questIds.ARTEFACTS_3, 0),
            makeAddItemTransform(itemDetails.DISCOVERS.id, 1),
            makeRemoveOxygenTransform(1200)
        ),
        [Actions.specificActions.STORE.BUY_PUMP]: (state) => {
            if (state.playerState.storedOxygen !== null) {
                throw 'Player already has an Oxygen Pump.';
            }
            return composite(
                makePlayerStatTransform('storedOxygen', 0),
                makeAddItemTransform(itemDetails.PUMP.id, 1),
                makeRemoveOxygenTransform(1800)
            )(state);
        },
        [Actions.specificActions.STORE.BUY_BLACK_ROCK]: composite(
            makeAdvanceQuestTransform(questIds.CLOAK_2, 0),
            makeAddItemTransform(itemDetails.BLACK_ROCK.id, 1),
            makeRemoveOxygenTransform(1800)
        ),
        [Actions.specificActions.STORE.BUY_BUBBLE_PASS]: composite(
            makePlayerStatTransform('hasBubblePass', true),
            makeAddItemTransform(itemDetails.BUBBLE.id, 1),
            makeRemoveOxygenTransform(2400)
        ),
    },
    [Locations.locationIds.STATUE]: {
        [Actions.specificActions.STATUE.EXPLORE]: composite(
            makeAdvanceQuestTransform(questIds.FINCHES, 1),
            makeAddMessageTransform(
                'You find a mysterious engraving at the base of the statue. It seems to be written in some sort of ancient language...'
            ),
            makePlayerStatTransform('foundEngraving', true),
            makeRemoveOxygenTransform(300)
        ),
        [Actions.specificActions.STATUE.DECODE_ENGRAVING]: (state) => {
            if (
                state.playerState.foundEngraving &&
                state.playerState.knowsLanguage
            )
                return composite(
                    makeAdvanceQuestTransform(questIds.FINCHES, 2),
                    makeAddMessageTransform('You have decoded the engraving.')
                )(state);

            throw 'Requirements not met.';
        },
        [Actions.ALL_OXYGEN.GET_OXYGEN]: (state) => {
            const now = Date.now();
            const oxygenToAdd =
                now - state.globalState.tritonOxygen.lastExtract.valueOf();
            logger.log(
                'info',
                `Player ${state.playerState.id} has accessed the Oxygen Stream at ${Locations.locationIds.STATUE}.`
            );
            return composite(
                makeAddOxygenTransform(oxygenToAdd),
                updateStreamCooldownTransform
            )({
                ...state,
                globalState: {
                    ...state.globalState,
                    tritonOxygen: {
                        lastTeam: state.playerState.id,
                        lastExtract: new Date(now),
                    },
                },
            });
        },
    },
    [Locations.locationIds.LIBRARY]: {
        [Actions.specificActions.LIBRARY.EXPLORE]: composite(
            makeIssueQuestTransform(questIds.ARTEFACTS_1),
            makeRemoveOxygenTransform(300)
        ),
        [Actions.specificActions.LIBRARY.STUDY_CRIMSON]: (state) => {
            if (!state.playerState.inventory[itemDetails.LIBRARY_PASS.id]?.qty)
                throw 'Requirements not met.';

            return composite(
                makeAdvanceQuestTransform(questIds.FINCHES_2, 1),
                makeAddMessageTransform(
                    'You have learnt more about the Crimson, a terrifying monster that almost destroyed Undersea civilization 10,000 years ago. Triton subdued the Crimson and kept it in a deep sleep using four different spells. It seems that the Crimson is incredibly sensitive to artefacts of strong healing value, and the presence of these artefacts could awaken it.'
                )
            )(state);
        },
        [Actions.specificActions.LIBRARY.STUDY_ARTEFACT]: (state) => {
            if (!state.playerState.inventory[itemDetails.LIBRARY_PASS.id]?.qty)
                throw 'Requirements not met.';

            return makeAdvanceQuestTransform(questIds.ARTEFACTS_1, 1)(state);
        },
        [Actions.specificActions.LIBRARY.DECODE_ARTEFACT]: (state) => {
            if (
                state.playerState.knowsLanguage &&
                state.playerState.quests[questIds.ARTEFACTS_2]?.status ===
                    'incomplete'
            ) {
                return makeAdvanceQuestTransform(
                    questIds.ARTEFACTS_2,
                    1
                )(state);
            }

            throw 'Requirements not met.';
        },
    },
    [Locations.locationIds.ANCHOVY]: {
        [Actions.specificActions.ANCHOVY.EXPLORE]: composite(
            makeIssueQuestTransform(questIds.LIBRARIAN_PASS),
            makeRemoveOxygenTransform(300)
        ),
        [Actions.specificActions.ANCHOVY.INSPIRE]: makeAdvanceQuestTransform(
            questIds.LIBRARIAN_PASS,
            0
        ),
    },
    [Locations.locationIds.BARNACLE]: {
        [Actions.specificActions.BARNACLE.EXPLORE]: composite(
            makeIssueQuestTransform(questIds.PYRITE),
            makeRemoveOxygenTransform(300)
        ),
        [Actions.specificActions.BARNACLE.HELP]: makeAdvanceQuestTransform(
            questIds.PYRITE,
            0
        ),
    },
    [Locations.locationIds.SALMON]: {
        [Actions.specificActions.SALMON.EXPLORE]: composite(
            makeIssueQuestTransform(questIds.ARGUMENT),
            makeRemoveOxygenTransform(300)
        ),
        [Actions.specificActions.SALMON.CONFRONT]: makeAdvanceQuestTransform(
            questIds.ARGUMENT,
            0
        ),
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
