import React from 'react';
import { JournalPages } from './Journal';
import './Journal.css';
import './JournalMenu.css';

export interface JournalMenuProps {
    handlePageSwitch: (jp: JournalPages) => () => void;
    knowsOxygen?: boolean;
    knowsChallengeMode?: boolean;
}

const JournalMenu = (props: JournalMenuProps): React.ReactElement => {
    const { handlePageSwitch, knowsOxygen, knowsChallengeMode } = props;

    return (
        <div className="journalMenu">
            <span>
                <b>&emsp;Journal Pages:&emsp;</b>
            </span>
            <button onClick={handlePageSwitch(JournalPages.QUEST_JOURNAL)}>
                {JournalPages.QUEST_JOURNAL}
            </button>
            <span>&emsp;</span>
            <button onClick={handlePageSwitch(JournalPages.ANNOUNCEMENTS)}>
                {JournalPages.ANNOUNCEMENTS}
            </button>
            <span>&emsp;</span>
            {knowsChallengeMode && (
                <button
                    onClick={handlePageSwitch(JournalPages.CHALLENGE_MODE_INFO)}
                >
                    {JournalPages.CHALLENGE_MODE_INFO}
                </button>
            )}
            <span>&emsp;</span>
            {knowsOxygen && (
                <button onClick={handlePageSwitch(JournalPages.OXYGEN)}>
                    {JournalPages.OXYGEN}
                </button>
            )}
        </div>
    );
};

export default JournalMenu;
