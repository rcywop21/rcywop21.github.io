import React from 'react';
import { JournalPages } from './Journal';
import './Journal.css';
import './JournalMenu.css';

export interface JournalMenuProps {
    handlePageSwitch: (jp: JournalPages) => () => void;
    knowsOxygen?: boolean;
    knowsChallengeMode?: boolean;
    isMentor?: boolean;
}

const JournalMenu = (props: JournalMenuProps): React.ReactElement => {
    const { handlePageSwitch, knowsOxygen, knowsChallengeMode, isMentor } = props;

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
            {(isMentor || knowsChallengeMode) && (
                <button
                    className={isMentor && !knowsChallengeMode ? "mentorHax" : ""}
                    onClick={handlePageSwitch(JournalPages.CHALLENGE_MODE_INFO)}
                >
                    {JournalPages.CHALLENGE_MODE_INFO}
                </button>
            )}
            <span>&emsp;</span>
            {(isMentor || knowsOxygen) && (
                <button 
                    className={isMentor && !knowsOxygen ? "mentorHax" : ""}
                    onClick={handlePageSwitch(JournalPages.OXYGEN)}>
                    {JournalPages.OXYGEN}
                </button>
            )}
            <span>&emsp;</span>
            {isMentor && <span className="mentorHax mentorHaxTextBox">Light blue = Only mentors can see this.</span>}
        </div>
    );
};

export default JournalMenu;
