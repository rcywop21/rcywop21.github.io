import { QuestId, questIds, quests } from 'wlcommon';
import { makeIssueQuestTransform } from './actions';
import { makeAddOxygenTransform } from './oxygen';
import { identityTransform, makeAddMessageTransform, Transform, TransformState } from './stateMgr';

const transforms: Record<QuestId, Transform> = {
    [questIds.CHAPTER_1]: makeAddOxygenTransform(20 * 60),
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
    }

    return result;
};
