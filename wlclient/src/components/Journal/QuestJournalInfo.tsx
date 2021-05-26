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
    let orderInstructionText = "Complete these tasks in any order:";
    
    if (fullQuestInfo.stageOrder === "inOrder") {
        currStage = stageInfo.indexOf(false);
        orderInstructionText = "Complete these tasks in the following order:"
    }
    
    function determineStageStyle(index: number): string {
        if (stageInfo[index]) {
            return "stageComplete";
        }
        return index > currStage ? "stageFuture" : "stageIncomplete";
    }

    const ListComponent = fullQuestInfo.stageOrder === 'inOrder' ? 'ol' : 'ul';

    // console.log(data.status);
    
    return (
        <div className="questjournalinfo">
            <h3 className={`subtitle subtitleColor ${data.status === 'completed' ? 'complete' : ''}`}>{title}</h3>
            <div className="description">{description}</div>
            <h4 className="orderinstruction">{orderInstructionText}</h4>
            <ListComponent>
                { stages.map((stage, index) => { return (
                    <li 
                        key={index}
                        className={determineStageStyle(index)}
                    >
                        {stage}
                    </li>); 
                }) }
            </ListComponent>
            {fullQuestInfo.reward && (<div>
                <h4 className="reward">Reward</h4>
                <ul>
                    {fullQuestInfo.reward.map((reward, i) => <li key={i}>{reward}</li>)}
                </ul>
                </div>)}
        </div>
    );
}

export default QuestJournalInfo;
