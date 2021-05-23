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
    
    if (questInfo.stageOrder === "inOrder") {
        const currProgress = questState.stages.indexOf(false);
        questSteps.push(questInfo.stages[currProgress]);
    }
    
    if (questInfo.stageOrder === "anyOrder") {
        for (let i = 0; i < questInfo.stages.length; i++) {
            questSteps.push(`${i+1}. ${questInfo.stages[i]}`);
        }
    }

    return (
        <div className="questInfo">
            <h4 className="questName">{questName}</h4>
            { questSteps.map((info) => <p key="" className="questStep">{info}</p>) }
        </div>
    );
};

export default QuestInfo;
