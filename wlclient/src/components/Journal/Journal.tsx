import React from 'react';
import JournalMenu from './JournalMenu';
import QuestJournal from './QuestJournal';
import Notes from './Notes';
import Oxygen from './Oxygen';
import { PlayerState } from 'wlcommon';
import './Journal.css';

export interface JournalProps {
    playerState: PlayerState;
    isMentor?: boolean;
}

export enum JournalPages {
    QUEST_JOURNAL = "Quest Journal",
    NOTES = "Notes",
    OXYGEN = "Oxygen"
}

const Journal = (props: JournalProps): React.ReactElement => {
    const { playerState, isMentor } = props;
    
    const [page, setPage] = React.useState<JournalPages>(JournalPages.QUEST_JOURNAL);
    
    function handlePageSwitch(page: JournalPages) {
        return () => { setPage(page); };
    }
    
    const pageElements: Map<JournalPages, React.ReactElement> = new Map([
        [JournalPages.QUEST_JOURNAL, <QuestJournal key="" questData={playerState.quests} />],
        [JournalPages.NOTES, <Notes key="" playerState="" />],
        [JournalPages.OXYGEN, <Oxygen key="" playerState="" />]
    ]);
    const pageElement: React.ReactElement = pageElements.get(page)!;
    
    return (
        <div className="journal">
            <JournalMenu handlePageSwitch={handlePageSwitch}/>
            {pageElement}
        </div>
    );
};

export default Journal;
