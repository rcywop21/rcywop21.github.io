import { itemDetails, QuestId, questIds, quests } from 'wlcommon';
import { makeAdvanceQuestTransform, makeIssueQuestTransform } from './actions';
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

const transforms: Record<QuestId, Transform> = {
    [questIds.CHAPTER_1]: makeAddOxygenTransform(20 * 60, false),
    [questIds.FINCHES_2]: composite(
        makeAddMessageTransform(
            'Refer to your Journal for details on the four spells used to keep the Crimson asleep.'
        ),
        makePlayerStatTransform('knowsCrimson', true)
    ),
    [questIds.LIBRARIAN_PASS]: makeAddItemTransform(
        itemDetails.LIBRARY_PASS.id,
        1
    ),
    [questIds.PYRITE]: makeAddItemTransform(itemDetails.PYRITE_PAN.id, 1),
    [questIds.SHRINE_2]: makeAddItemTransform(itemDetails.UNICORN_TEAR.id, 1),
};

const postUnlock: Record<QuestId, Transform> = {
    [questIds.ARTEFACTS_1]: (state) =>
        (state.playerState.knowsLanguage
            ? makeAdvanceQuestTransform(questIds.ARTEFACTS_2, 0)
            : identityTransform)(state),
    [questIds.CLOAK_1]: (state) => (state.playerState.inventory[itemDetails.BLACK_ROCK.id]?.qty ? makeAdvanceQuestTransform(questIds.CLOAK_2, 0) : identityTransform)(state),
    [questIds.SHRINE_2]: (state) => makeAdvanceQuestTransform(questIds.CHAPTER_2, 0)(state)
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
