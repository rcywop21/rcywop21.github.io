import React from 'react';
import JournalMenu from './JournalMenu';
import QuestJournal from './QuestJournal';
import ChallengeModeInfo from './ChallengeModeInfo';
import Oxygen from './Oxygen';
import Announcements from './Announcements';
import { PlayerState, GlobalState, questIds } from 'wlcommon';
import './Journal.css';

export interface JournalProps {
    playerState: PlayerState;
    globalState: GlobalState;
    isMentor?: boolean;
}

export enum JournalPages {
    QUEST_JOURNAL = 'Quest Journal',
    CHALLENGE_MODE_INFO = 'Challenge Mode',
    OXYGEN = 'Oxygen',
    ANNOUNCEMENTS = 'Announcements',
}

const Journal = (props: JournalProps): React.ReactElement => {
    const { playerState, globalState, isMentor } = props;

    const knowsChallengeMode =
        (playerState.quests[questIds.FINCHES_2] &&
            playerState.quests[questIds.FINCHES_2].status === 'completed') ||
        (playerState.quests[questIds.SHRINE_1] &&
            playerState.quests[questIds.SHRINE_1].status === 'completed');

    const [page, setPage] = React.useState<JournalPages>(
        JournalPages.QUEST_JOURNAL
    );

    function handlePageSwitch(page: JournalPages) {
        return () => {
            setPage(page);
        };
    }

    const pageElements: Map<JournalPages, React.ReactElement> = new Map([
        [
            JournalPages.QUEST_JOURNAL,
            <QuestJournal key="qj" questData={playerState.quests} />,
        ],
        [
            JournalPages.CHALLENGE_MODE_INFO,
            <ChallengeModeInfo
                key="n"
                playerState={playerState}
                globalState={globalState}
                isMentor={isMentor}
            />,
        ],
        [
            JournalPages.OXYGEN,
            <Oxygen
                key="o"
                playerState={playerState}
                globalState={globalState}
                isMentor={isMentor}
            />,
        ],
        [
            JournalPages.ANNOUNCEMENTS,
            <Announcements key="a" globalState={globalState} />,
        ],
    ]);

    return (
        <div className="journal">
            <JournalMenu
                handlePageSwitch={handlePageSwitch}
                knowsOxygen={playerState.knowsOxygen}
                knowsChallengeMode={knowsChallengeMode}
                isMentor={isMentor}
            />
            {pageElements.get(page)}
        </div>
    );
};

export default Journal;
