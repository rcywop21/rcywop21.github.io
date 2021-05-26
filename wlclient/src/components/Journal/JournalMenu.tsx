import React from 'react';
import { JournalPages } from './Journal';
import './Journal.css';
import './JournalMenu.css';

export interface JournalMenuProps {
    handlePageSwitch: (jp: JournalPages) => () => void;
    knowsOxygen?: boolean;
}

const JournalMenu = (props: JournalMenuProps): React.ReactElement => {
    const { handlePageSwitch, knowsOxygen } = props;
    
    return (
        <div className="journalMenu">
            <span><b>&emsp;Journal Pages:&emsp;</b></span>
            <button onClick={handlePageSwitch(JournalPages.QUEST_JOURNAL)}>
                Quest Journal
            </button>
            <span>&emsp;</span>
            <button onClick={handlePageSwitch(JournalPages.NOTES)}>
                Notes
            </button>
            <span>&emsp;</span>
            {knowsOxygen && <button onClick={handlePageSwitch(JournalPages.OXYGEN)}>
                Oxygen
            </button>}
        </div>
    );
}

export default JournalMenu;
