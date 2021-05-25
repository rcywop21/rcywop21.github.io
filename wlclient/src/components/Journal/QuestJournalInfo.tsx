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
    
    return (
        <div>
            <h3 className="subtitle">{title}</h3>
            <p>{description}</p>
            <ol>
                { stages.map((stage, index) => <li key={index}>{stage}</li>) }
            </ol>
        </div>
    );
}

export default QuestJournalInfo;