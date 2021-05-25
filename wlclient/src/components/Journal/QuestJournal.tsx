import React from 'react';
import QuestJournalInfo from './QuestJournalInfo';
import { QuestId, QuestState } from 'wlcommon';
import './Journal.css';

export interface QuestJournalProps {
    questData: Record<QuestId, QuestState>;
}

const QuestJournal = (props: QuestJournalProps): React.ReactElement => {
    const { questData } = props;
    
    const listOfQuests = Object.values(questData);
    listOfQuests.sort((q1: QuestState, q2: QuestState) => { 
        if (q1.status === q2.status) {
            return q2.id - q1.id;
        } return q2.status < q1.status ? -1 : 1 });
    
    return (
        <div>
            <h2 className="journalTitle">QUEST JOURNAL</h2>
            <p className="helptext">
                <em>This journal contains all 
                    information you have regarding quests.</em>
            </p>
            { listOfQuests.map((qs) => <QuestJournalInfo key="qs.id" data={qs} />) }
        </div>
    );
}

export default QuestJournal;