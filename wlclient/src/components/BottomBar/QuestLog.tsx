import React from 'react';
import QuestInfo from './QuestInfo';
import { QuestId, QuestState } from 'wlcommon';
import './QuestLog.css';

export interface QuestLogProps {
    quests: Record<QuestId, QuestState>;
}

const QuestLog = (props: QuestLogProps): React.ReactElement => {
    const { quests } = props;
    
    const questStates: QuestState[] = Object.values(quests)
        .filter((qs) => qs.status !== "completed")
        .sort((q1, q2) => q1.id < q2.id ? 1 : -1);

    return (
        <div className="questLog">
            <h2 className="questTitle">QUESTS</h2>
            <div className="innerQuestBox">
                {questStates.map((item: QuestState) => (
                    <QuestInfo key="" questState={item} />
                ))}
            </div>
        </div>
    );
};

export default QuestLog;
