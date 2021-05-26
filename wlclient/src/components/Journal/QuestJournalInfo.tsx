import React from 'react';
import { Quest, QuestState, quests } from 'wlcommon';
import './Journal.css';
import './QuestJournalInfo.css';

export interface QuestJournalInfoProps {
    data: QuestState;
}

const QuestJournalInfo = (props: QuestJournalInfoProps): React.ReactElement => {
    const { data } = props;
    
    const fullQuestInfo: Quest = quests[data.id];
    const title = fullQuestInfo.name;
    const description = fullQuestInfo.description;
    const stages = fullQuestInfo.stages;
    const stageInfo = data.stages;
    
    let currStage = 999;
    let orderInstructionText = "Complete the following in any order:";
    
    if (fullQuestInfo.stageOrder === "inOrder") {
        currStage = stageInfo.indexOf(false);
        orderInstructionText = "Complete the following in the following order:"
    }
    
    function determineStageStyle(index: number): string {
        if (stageInfo[index]) {
            return "stageComplete";
        }
        return index > currStage ? "stageFuture" : "stageIncomplete";
    }

    const ListComponent = fullQuestInfo.stageOrder === 'inOrder' ? 'ol' : 'ul';
    
    return (
        <div>
            <h3 className="subtitle subtitleColor">{title}</h3>
            <p>{description}</p>
            <p>{orderInstructionText}</p>
            <ListComponent>
                { stages.map((stage, index) => { return (
                    <li 
                        key="" 
                        className={determineStageStyle(index)}
                    >
                        {stage}
                    </li>); 
                }) }
            </ListComponent>
            {fullQuestInfo.reward && (<div>
                    <h4>Reward</h4>
                    <ul>
                        {fullQuestInfo.reward.map((reward, i) => <li key={i}>{reward}</li>)}
                    </ul>
                </div>)}
        </div>
    );
}

export default QuestJournalInfo;
