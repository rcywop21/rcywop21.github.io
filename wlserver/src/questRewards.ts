import { QuestId, questIds, quests } from "wlcommon"
import { makeIssueQuestTransform } from "./actions";
import { identityTransform, Transform, TransformState } from "./stateMgr";

const transforms: Record<QuestId, Transform> = {
    [questIds.CHAPTER_1]: (state) => {
        const oxygenUntil = state.playerState.oxygenUntil?.valueOf() + 30 * 60 * 1000;
        const newOxygen = oxygenUntil === null ? null : new Date(oxygenUntil);
        return {
            ...state,
            playerState: {
                ...state.playerState,
                oxygenUntil: newOxygen,
                hasMap: true,
            },
        };
    }
}

export const makePostCompletionTransform = (questId: QuestId): Transform => (state) => {
    let completionMsg = `You have completed a quest - ${quests[questId].name}!`;
    if (quests[questId].reward) {
        completionMsg += ` You receive: ${quests[questId].reward.join(', ')}`
    }

    let result: TransformState = {
        globalState: state.globalState,
        playerState: {
            ...state.playerState,
            quests: {
                ...state.playerState.quests,
                [questId]: {
                    ...state.playerState.quests[questId],
                    status: 'completed',
                }
            },
        },
        messages: [ ...state.messages, completionMsg ]
    };

    result = (transforms[questId] ?? identityTransform)(result);

    if (quests[questId].unlocks) {
        result = makeIssueQuestTransform(quests[questId].unlocks)(result);
    }

    return result;
};


