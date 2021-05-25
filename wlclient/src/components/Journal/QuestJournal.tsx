import React from 'react';
import QuestJournalInfo from './QuestJournalInfo';
import { QuestId, QuestState } from 'wlcommon';
import './Journal.css';

export interface QuestJournalProps {
    questData: Record<QuestId, QuestState>;
}

const QuestJournal = (props: QuestJournalProps): React.ReactElement => {
    const { questData } = props;
    
    return (
        <div>
            <h2 className="journalTitle">QUEST JOURNAL</h2>
            <p className="helptext">
                <em>This journal contains all 
                    information you have regarding quests.</em>
            </p>
            { Object.values(questData).map((qs) => <QuestJournalInfo key="qs.id" data={qs} />) }
        </div>
    );
}

export default QuestJournal;