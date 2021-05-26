import { itemDetails, Locations, QuestId, questIds, quests } from 'wlcommon';
import { makeAddItemTransform } from './inventory';
import { makeAddOxygenTransform } from './oxygen';
import {
    composite,
    identityTransform,
    makeAddMessageTransform,
    makePlayerStatTransform,
    Transform,
    TransformState,
} from './stateMgr';

export const makeIssueQuestTransform = (questId: QuestId): Transform => (
    state
) => {
    if (state.playerState.quests[questId]) return state;
    const questDetails = quests[questId];
    if (questDetails === undefined) throw `Unknown quest ID ${questId}`;
    return composite(
        makeAddMessageTransform(
            `You have received a new quest - ${quests[questId].name}. Check your Quest Journal for more information.`
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
    
    if (questState.status === 'completed')
        return state;

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

const transforms: Record<QuestId, Transform> = {
    [questIds.CHAPTER_1]: makeAddOxygenTransform(20 * 60, false),
    [questIds.FINCHES_2]: composite(
        makeAddMessageTransform(
            'Refer to your Journal for details on the four spells used to keep the Crimson asleep.'
        ),
        makePlayerStatTransform('knowsCrimson', true)
    ),
    [questIds.LIBRARIAN_PASS]: composite(
        makeAdvanceQuestTransform(questIds.ARTEFACTS_1, 0),
        makeAdvanceQuestTransform(questIds.FINCHES_2, 0),
        makeAddItemTransform(itemDetails.LIBRARY_PASS.id, 1)
    ),
    [questIds.ARGUMENT]: composite(
        makeAdvanceQuestTransform(questIds.ARTEFACTS_3, 1),
        makeAddItemTransform(itemDetails.STAFF.id, 1)
    ),
    [questIds.PYRITE]: composite(
        makeAdvanceQuestTransform(questIds.CLOAK_1, 0),
        makeAddItemTransform(itemDetails.PYRITE_PAN.id, 1)
    ),
    [questIds.SHRINE_2]: (state) => { 
        let result = makeAddItemTransform(itemDetails.UNICORN_TEAR.id, 1)(state);
        result = makeAdvanceQuestTransform(questIds.CHAPTER_2, 0)(state);
        result = makeAddMessageTransform({
            text: `[Announcement] Team ${state.playerState.id} has found the Unicorn's Tear!`,
            visibility: 'public'
        })(state);
        result.globalState.artefactsFound += 1;
        return result;
    },
    [questIds.ARTEFACTS_4]: composite(
        makePlayerStatTransform('locationId', Locations.locationIds.ALCOVE),
        makePlayerStatTransform('unlockedAlcove', true),
    ),
    [questIds.CLOAK_1]: (state) => (state.playerState.inventory[itemDetails.BLACK_ROCK.id]?.qty ? makeAdvanceQuestTransform(questIds.CLOAK_2, 0) : identityTransform)(state),
    [questIds.CLOAK_3]: makeAddMessageTransform(
        "You return to the Umbral Ruins, but it seems that Alyusi has disappeared. Without returning your Oxygen! You call his name out loud, but nobody came.\n\nYou glance at the blinkseed, and you can't help but think it looks, smells and feels exactly like common seaweed..."
    )
};

const postUnlock: Record<QuestId, Transform> = {
    [questIds.ARTEFACTS_1]: (state) =>
        (state.playerState.knowsLanguage
            ? makeAdvanceQuestTransform(questIds.ARTEFACTS_2, 0)
            : identityTransform)(state),
    [questIds.CLOAK_1]: (state) => (state.playerState.inventory[itemDetails.BLACK_ROCK.id]?.qty ? makeAdvanceQuestTransform(questIds.CLOAK_2, 0) : identityTransform)(state),
    [questIds.FINCHES]: (state) => (state.playerState.inventory[itemDetails.LIBRARY_PASS.id]?.qty ? makeAdvanceQuestTransform(questIds.FINCHES_2, 0) : identityTransform)(state),
    [questIds.ARTEFACTS_2]: (state) => {
        let result = state;
        if (state.playerState.inventory[itemDetails.DISCOVERS.id]?.qty)
            result = makeAdvanceQuestTransform(questIds.ARTEFACTS_3, 0)(result);
        if (state.playerState.inventory[itemDetails.STAFF.id]?.qty)
            result = makeAdvanceQuestTransform(questIds.ARTEFACTS_3, 1)(result);
        return result;
    },
    [questIds.SHRINE_2]: (state) => makeAdvanceQuestTransform(questIds.CHAPTER_2, 0)(state),
};

export const makePostCompletionTransform = (questId: QuestId): Transform => (
    state
) => {
    let completionMsg = `You have completed a quest - ${quests[questId].name}!`;
    if (quests[questId].reward) {
        completionMsg += ` You receive: ${quests[questId].reward.join(', ')}`;
    }

    let result: TransformState = makeAddMessageTransform(completionMsg)({
        ...state,
        playerState: {
            ...state.playerState,
            quests: {
                ...state.playerState.quests,
                [questId]: {
                    ...state.playerState.quests[questId],
                    status: 'completed',
                },
            },
        },
    });

    result = (transforms[questId] ?? identityTransform)(result);

    if (quests[questId].unlocks) {
        result = makeIssueQuestTransform(quests[questId].unlocks)(result);
        if (postUnlock[questId]) {
            result = postUnlock[questId](result);
        }
    }

    return result;
};
