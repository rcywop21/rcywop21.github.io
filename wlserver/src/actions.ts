import {
    Actions,
    Locations,
    Util,
    questIds,
    itemDetails,
    Action,
} from 'wlcommon';
import { locationIds } from 'wlcommon/build/locations';
import { makeAddItemTransform, makeRemoveItemTransform } from './inventory';
import logger from './logger';
import {
    makeAddOxygenTransform,
    makeRemoveOxygenTransform,
    updateStreamCooldownTransform,
} from './oxygen';
import {
    makeAdvanceQuestTransform,
    makeIssueQuestTransform,
} from './questRewards';
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
        [Actions.specificActions.SHORES.DIVE]: (state) => {
            const doChallengeMode =
                state.playerState.inventory[itemDetails.UNICORN_HAIR.id]?.qty;
            const now = Date.now();
            const INCREMENT = 20 * 60 * 1000;
            let result = composite(
                makeAdvanceQuestTransform(questIds.CHAPTER_1, 0),
                makeAdvanceQuestTransform(questIds.SHRINE_2, 2),
                makeAddMessageTransform(
                    'You dive into the deep blue sea... and arrive at the Shallows!'
                ),
                makePlayerStatTransform(
                    'locationId',
                    Locations.locationIds.SHALLOWS
                )
            )(state);
            if (doChallengeMode) {
                result = makePlayerStatTransform(
                    'oxygenUntil',
                    new Date(
                        now +
                            INCREMENT *
                                Math.max(
                                    0.15,
                                    0.125 +
                                        0.025 * state.globalState.artefactsFound
                                )
                    )
                )(result);
                result = makePlayerStatTransform(
                    'challengeMode',
                    new Date(now + 1800000)
                )(result);
                result = makeAddMessageTransform(
                    "You are now in Challenge Mode. Reminder: In Challenge Mode, you will receive much less Oxygen from Oxygen Streams and your pump is disabled. Bring the Unicorn's Hair to the Shrine and survive for 30 minutes without resurfacing to complete your quest!"
                )(result);
            } else {
                result = makePlayerStatTransform(
                    'oxygenUntil',
                    new Date(now + INCREMENT)
                )(result);
            }
            return result;
        },
    },
    [Locations.locationIds.CORALS]: {
        [Actions.specificActions.CORALS.EXPLORE]: composite(
            makeIssueQuestTransform(questIds.FINCHES),
            makeAddMessageTransform(
                'While exploring the historical exhibits at the Memorial Corals, you have found something interesting.'
            ),
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
            makeAddMessageTransform(
                'With the map, you can now access more locations in the Undersea! Remember that if you want to return to the Sleepy Shores, you have to use Resurface.'
            ),
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
            makeAdvanceQuestTransform(questIds.ARTEFACTS_4, 0),
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
                makeAddOxygenTransform(Math.floor(oxygenToAdd * 3 / 1000)),
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
        [Actions.specificActions.LIBRARY.EXPLORE]: (state) => {
            let result = composite(
                makeIssueQuestTransform(questIds.ARTEFACTS_1),
                makeAddMessageTransform(
                    'You approach the librarians and ask them about the artefacts of the Undersea...'
                ),
                makeRemoveOxygenTransform(300)
            )(state);
            if (result.playerState.inventory[itemDetails.LIBRARY_PASS.id]?.qty)
                result = makeAdvanceQuestTransform(
                    questIds.ARTEFACTS_1,
                    0
                )(result);
            return result;
        },
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
            makeAddMessageTransform(
                'You hear two young children causing a ruckus. Turning around, you see them chasing each other with a pointed stick. How dangerous!'
            ),
            makeRemoveOxygenTransform(300)
        ),
        [Actions.specificActions.SALMON.CONFRONT]: makeAdvanceQuestTransform(
            questIds.ARGUMENT,
            0
        ),
        [Actions.ALL_OXYGEN.GET_OXYGEN]: (state) => {
            const { linkedStreams } = state.globalState;
            if (linkedStreams.lastSalmonId !== undefined)
                throw 'This stream has already been activated.';
            if (linkedStreams.lastCatfishId === state.playerState.id)
                throw 'Same player cannot activate both ends of the linked streams.';
            return composite(
                makeAddMessageTransform(
                    'You activate the Salmon Street end of the linked Oxygen Streams, waiting for someone else to activate the other end.'
                ),
                makeAddOxygenTransform(600),
                updateStreamCooldownTransform
            )({
                ...state,
                globalState: {
                    ...state.globalState,
                    linkedStreams: {
                        ...state.globalState.linkedStreams,
                        lastSalmonId: state.playerState.id,
                        lastSalmon: new Date(),
                    },
                },
            });
        },
    },
    [Locations.locationIds.TUNA]: {
        [Actions.ALL_OXYGEN.GET_OXYGEN]: composite(
            makeAddOxygenTransform(1800),
            updateStreamCooldownTransform
        ),
    },
    [Locations.locationIds.CATFISH]: {
        [Actions.ALL_OXYGEN.GET_OXYGEN]: (state) => {
            const { linkedStreams } = state.globalState;
            if (linkedStreams.lastCatfishId !== undefined)
                throw 'This stream has already been activated.';
            if (linkedStreams.lastSalmonId === state.playerState.id)
                throw 'Same player cannot activate both ends of the linked streams.';
            return composite(
                makeAddMessageTransform(
                    'You activate the Catfish Crescent end of the linked Oxygen Streams, waiting for someone else to activate the other end.'
                ),
                makeAddOxygenTransform(600),
                updateStreamCooldownTransform
            )({
                ...state,
                globalState: {
                    ...state.globalState,
                    linkedStreams: {
                        ...state.globalState.linkedStreams,
                        lastCatfishId: state.playerState.id,
                        lastCatfish: new Date(),
                    },
                },
            });
        },
    },
    [Locations.locationIds.BUBBLE]: {
        [Actions.ALL_OXYGEN.GET_OXYGEN]: (state) => {
            if (!state.playerState.hasBubblePass) throw 'Requirements not met.';
            return composite(
                makeAddOxygenTransform(2400),
                updateStreamCooldownTransform
            )(state);
        },
    },
    [Locations.locationIds.KELP]: {
        [Actions.specificActions.KELP.EXPLORE]: composite(
            makeIssueQuestTransform(questIds.SHRINE_1),
            makeAddMessageTransform(
                'You wander around the Kelp Plains. Behind a very thick patch of seaweed, you notice a small valley...'
            ),
            makeRemoveOxygenTransform(300)
        ),
        [Actions.specificActions.KELP.CLIMB_DOWN]: composite(
            makeAdvanceQuestTransform(questIds.SHRINE_1, 0),
            makePlayerStatTransform('locationId', locationIds.SHRINE),
            makePlayerStatTransform('unlockedWoods', true),
            makePlayerStatTransform('unlockedShrine', true)
        ),
        [Actions.specificActions.KELP.HARVEST]: (state) => {
            let result = composite(
                makeAdvanceQuestTransform(questIds.CLOAK_3, 0),
                makeAddItemTransform(itemDetails.BLINKSEED.id, 1)
            )(state);
            if (
                result.playerState.inventory[itemDetails.BLINKSEED.id]?.qty >= 3
            ) {
                console.log('advancing quest');
                result = makeAdvanceQuestTransform(questIds.CLOAK_3, 1)(result);
            }
            return result;
        },
    },
    [Locations.locationIds.SHRINE]: {
        [Actions.specificActions.SHRINE.GIVE_HAIR]: composite(
            makeAdvanceQuestTransform(questIds.SHRINE_2, 3),
            makeRemoveItemTransform(itemDetails.UNICORN_HAIR.id, 1)
        ),
        [Actions.specificActions.SHRINE
            .COLLECT_HAIR]: makeAdvanceQuestTransform(questIds.SHRINE_2, 5),
    },
    [Locations.locationIds.UMBRAL]: {
        [Actions.specificActions.UMBRAL.EXPLORE]: (state) => {
            let result = makeIssueQuestTransform(questIds.CLOAK_1)(state);
            result = makeAddMessageTransform(
                'Wandering around the ruins, you notice a shady-looking man in a cloak. You make eye contact with him...'
            )(result);
            if (state.playerState.inventory[itemDetails.PYRITE_PAN.id]?.qty)
                result = makeAdvanceQuestTransform(questIds.CLOAK_1, 0)(result);
            return result;
        },
        [Actions.specificActions.UMBRAL.GIVE_PAN]: (state) => {
            if (state.playerState.inventory[itemDetails.PYRITE_PAN.id]?.qty)
                return makeAdvanceQuestTransform(questIds.CLOAK_1, 1)(state);
            throw 'Requirements not met.';
        },
        [Actions.specificActions.UMBRAL.GIVE_ROCK]: composite(
            makeAdvanceQuestTransform(questIds.CLOAK_2, 1),
            makeRemoveItemTransform(itemDetails.BLACK_ROCK.id, 1)
        ),
    },
    [Locations.locationIds.WOODS]: {
        [Actions.specificActions.WOODS.GET_HAIR]: composite(
            makeAdvanceQuestTransform(questIds.SHRINE_2, 1),
            makeAddItemTransform(itemDetails.UNICORN_HAIR.id, 1)
        ),
    },
    [Locations.locationIds.ALCOVE]: {
        [Actions.specificActions.ALCOVE.RETRIEVE_PEARL]: (state) => {
            const result = composite(
                makeAdvanceQuestTransform(questIds.CHAPTER_2, 1),
                makeAddItemTransform(itemDetails.PEARL.id, 1),
                makeAddMessageTransform({
                    text: `[ANNOUNCEMENT] Team ${state.playerState.id} has found the Pearl of Asclepius!`,
                    visibility: 'public',
                })
            )(state);
            result.globalState.artefactsFound += 1;
            return result;
        },
    },
};

const applyUnderwaterAction: Transform = (state) => {
    if (!Locations.locationsMapping[state.playerState.locationId].undersea)
        throw 'You cannot perform this action as you are not undersea.';

    switch (state.playerState.stagedAction) {
        case Actions.ALL_UNDERWATER.RESURFACE:
            return composite(
                makeAddMessageTransform(
                    'You have resurfaced and returned to Sleepy Shores.'
                ),
                makeAdvanceQuestTransform(questIds.SHRINE_2, 0),
                makePlayerStatTransform('oxygenUntil', null),
                makePlayerStatTransform(
                    'locationId',
                    Locations.locationIds.SHORES
                ),
                makePlayerStatTransform('challengeMode', null)
            )(state);

        case Actions.ALL_UNDERWATER.STORE_OXYGEN: {
            const {
                oxygenUntil,
                challengeMode,
                storedOxygen,
            } = state.playerState;
            if (oxygenUntil === null || storedOxygen === null)
                throw 'Requirements not met.';
            if (challengeMode) throw 'Cannot do this in Challenge Mode.';

            const oxygenToStore = Math.max(
                0,
                oxygenUntil.valueOf() - Date.now() - 90 * 1000
            );

            return composite(
                makeAddMessageTransform(
                    `You have transferred ${Util.formatDuration(
                        oxygenToStore
                    )} of Oxygen to storage.`
                ),
                makePlayerStatTransform(
                    'storedOxygen',
                    storedOxygen + oxygenToStore
                ),
                makeAddOxygenTransform(-oxygenToStore, false)
            )(state);
        }

        case Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN: {
            const { challengeMode, storedOxygen } = state.playerState;
            if (storedOxygen === null)
                throw "You cannot perform this action as you don't have an oxygen tank.";
            if (challengeMode) throw 'Cannot do this in Challenge Mode.';

            return composite(
                makeAddMessageTransform(
                    `You have withdrawn ${Util.formatDuration(
                        storedOxygen
                    )} of Oxygen from storage.`
                ),
                makePlayerStatTransform('storedOxygen', 0),
                makeAddOxygenTransform(storedOxygen, true)
            )(state);
        }
    }

    throw 'Action not implemented.';
};

export default applyAction;
