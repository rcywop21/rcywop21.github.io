import React from 'react';
import { quests, QuestState } from 'wlcommon';
import './QuestInfo.css';

export interface QuestInfoProps {
    questState: QuestState;
}

const QuestInfo = (props: QuestInfoProps): React.ReactElement => {
    const { questState } = props;

    const questInfo = quests[questState.id];
    const questName = questInfo.name;
    const questSteps: string[] = [];

    const currProgress = questState.stages.indexOf(false);

    if (questInfo.stageOrder === 'inOrder') {
        questSteps.push(questInfo.stages[currProgress]);
    }

    if (questInfo.stageOrder === 'anyOrder') {
        for (let i = currProgress; i < questInfo.stages.length; i++) {
            !questState.stages[i] &&
                questSteps.push(`\u{2022} ${questInfo.stages[i]}`);
        }
    }

    return (
        <div className="questInfo">
            <h4 className="questName">{questName}</h4>
            {questSteps.map((info, index) => (
                <p key={index} className="questStep">
                    {info}
                </p>
            ))}
        </div>
    );
};

export default QuestInfo;
