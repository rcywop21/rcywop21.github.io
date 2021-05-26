import React from 'react';
import JournalMenu from './JournalMenu';
import QuestJournal from './QuestJournal';
import Notes from './Notes';
import Oxygen from './Oxygen';
import { PlayerState, GlobalState } from 'wlcommon';
import './Journal.css';

export interface JournalProps {
    playerState: PlayerState;
    globalState: GlobalState;
    isMentor?: boolean;
}

export enum JournalPages {
    QUEST_JOURNAL = "Quest Journal",
    NOTES = "Notes",
    OXYGEN = "Oxygen"
}

const Journal = (props: JournalProps): React.ReactElement => {
    const { playerState, globalState } = props;
    
    const [page, setPage] = React.useState<JournalPages>(JournalPages.QUEST_JOURNAL);
    
    function handlePageSwitch(page: JournalPages) {
        return () => { setPage(page); };
    }
    
    const pageElements: Map<JournalPages, React.ReactElement> = new Map([
        [JournalPages.QUEST_JOURNAL, <QuestJournal key="qj" questData={playerState.quests} />],
        [JournalPages.NOTES, <Notes key="n" playerState="" />],
        [JournalPages.OXYGEN, <Oxygen key="o" playerState={playerState} globalState={globalState}/>]
    ]);

    return (
        <div className="journal">
            <JournalMenu handlePageSwitch={handlePageSwitch} knowsOxygen={playerState.knowsOxygen} />
            {pageElements.get(page)}
        </div>
    );
};

export default Journal;
