import React from 'react';
import './QuestInfo.css';

export interface QuestInfoProps {
    questData: string[];
}

const QuestInfo = (props: QuestInfoProps): React.ReactElement => {
    const { questData } = props;
    
    const questName = questData[0];
    const questStep = questData[1];
    
    return (
        <div className="questInfo">
            <h4 className="questName">{questName}</h4>
            <p className="questStep">{questStep}</p>
        </div>
    );
}

export default QuestInfo;