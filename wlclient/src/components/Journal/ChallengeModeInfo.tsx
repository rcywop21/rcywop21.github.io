import React from 'react';
import { PlayerState, GlobalState, questIds, QuestId } from 'wlcommon';
import './Journal.css';
import './ChallengeModeInfo.css';
import { formatTime } from '../../util';

export interface ChallengeModeInfoProps {
    playerState: PlayerState;
    globalState: GlobalState;
    isMentor?: boolean;
}

const ChallengeModeInfo = (
    props: ChallengeModeInfoProps
): React.ReactElement => {
    const { playerState, globalState, isMentor } = props;

    function isQuestComplete(id: QuestId): boolean {
        return (
            playerState.quests[id] &&
            playerState.quests[id].status === 'completed'
        );
    }

    const completeShrine = isQuestComplete(questIds.SHRINE_1);
    const completeFinchesCode = isQuestComplete(questIds.FINCHES_2);

    const howToEnterChallengeModeText = (completeShrine: boolean) =>
        completeShrine
            ? "Challenge Mode begins when you dive into the Undersea while holding Unicorn's Hair. " +
              'It ends when you leave the Undersea, or when you complete the full duration of the challenge.'
            : 'You have not found out how to enter Challenge Mode yet. ' +
              'Perhaps someone with more mystical knowledge can help you?';

    const challengeModeModifier = Math.max(
        15,
        12.5 + 2.5 * globalState.artefactsFound
    ).toFixed(1);

    const challengeModeModifierText = (completeFinchesCode: boolean) =>
        completeFinchesCode ? (
            <React.Fragment>
                <p>
                    The difficulty of Challenge Mode is measured by a
                    percentage. It starts at 15.0%. This means that when you get
                    Oxygen, you will only get 15.0% of the normal amount of
                    Oxygen. For example, Diving normally gives you 20 minutes of
                    Oxygen. With Challenge Mode (15.0%), you will only get 3
                    minutes of Oxygen from Diving.
                </p>
                <p>
                    However, powerful magical artefacts can increase this
                    percentage. For every artefact (except the first, which has
                    no effect) found <b>between all groups</b>, this percentage
                    will increase by 2.5%.
                </p>
                <div className="challenge-mode-table">
                    <div className="header">Artefacts found</div>
                    <div className="header">0 to 1</div>
                    <div className="header">2</div>
                    <div className="header">3</div>
                    <div className="header">4</div>
                    <div className="header">5</div>
                    <div className="hstart">You will receive...</div>
                    <div>15.0% of the normal amount of Oxygen</div>
                    <div>17.5% of the normal amount of Oxygen</div>
                    <div>20.0% of the normal amount of Oxygen</div>
                    <div>22.5% of the normal amount of Oxygen</div>
                    <div>25.0% of the normal amount of Oxygen</div>
                    <div className="header">Artefacts Found</div>
                    <div className="header">6</div>
                    <div className="header">7</div>
                    <div className="header">8</div>
                    <div className="header">9</div>
                    <div className="header">10</div>
                    <div className="hstart">You will receive...</div>
                    <div>27.5% of the normal amount of Oxygen</div>
                    <div>30.0% of the normal amount of Oxygen</div>
                    <div>32.5% of the normal amount of Oxygen</div>
                    <div>35.0% of the normal amount of Oxygen</div>
                    <div>Game is complete!</div>
                </div>
                <p>
                    For example, if 5 artefacts have been found between all the
                    groups, Challenge Mode will be at 25.0%. Then, in that
                    situation, you will get 5 minutes of Oxygen from Diving.
                </p>
                <p>
                    Currently, {globalState.artefactsFound} artefacts have been
                    found between all teams. Hence, you will get{' '}
                    <span className="percentage">{challengeModeModifier}%</span>{' '}
                    of the normal amount of Oxygen if you are in Challenge Mode.
                </p>
            </React.Fragment>
        ) : (
            <p>
                You have not found out how exactly does Challenge Mode affect
                your oxygen gain. Perhaps it will be written down in some
                ancient tome?{' '}
            </p>
        );

    const currentlyInChallengeModeText = playerState.challengeMode && (
        <React.Fragment>
            <h3 className="subtitle challengeColor">
                You are currently in Challenge Mode
                {completeFinchesCode && ` (${challengeModeModifier}%)`}!
            </h3>
            <p>
                Challenge Mode will end at{' '}
                {formatTime(new Date(playerState.challengeMode))}.
            </p>
            {completeFinchesCode && (
                <p>
                    With {globalState.artefactsFound} artefacts found among all
                    teams, you will get{' '}
                    <span className="percentage">{challengeModeModifier}%</span>{' '}
                    of the normal amount of Oxygen if you are in Challenge Mode.{' '}
                    {playerState.hasMap &&
                        'You can check the Oxygen Guide for the exact amount of Oxygen you get from each Oxygen Stream.'}
                </p>
            )}
        </React.Fragment>
    );

    return (
        <div>
            <h2 className="journalTitle">CHALLENGE MODE INFO</h2>
            <p className="helptext">
                This page contains information you have uncovered about
                Challenge Mode.
                {isMentor && !completeShrine && !completeFinchesCode && (
                    <span className="mentorHax">
                        <br />
                        {` Your cadets have not unlocked this page of the journal yet. This page is unlocked by completing either \
                        "The Finches Code, Decoded" or "Shrine of the Innocent, Part 1". \
                        Completing both grants additional information.`}
                    </span>
                )}
            </p>
            {currentlyInChallengeModeText}
            <h3 className="subtitle subtitleColor">What is Challenge Mode?</h3>
            <p>
                During Challenge Mode, you will receive much less Oxygen from
                diving and from Oxygen Streams than stated. If you have an
                Oxygen Pump, it will not be able to function for the duration of
                Challenge Mode. Challenge Mode lasts for 30 minutes.
            </p>
            <h3 className="subtitle subtitleColor">
                How do you enter Challenge Mode?
            </h3>
            <p>
                {howToEnterChallengeModeText(completeShrine)}
                {isMentor && !completeShrine && (
                    <span className="mentorHax">
                        <br />
                        {`This info is unlocked by "Shrine of the Innocent, Part 1" and unlocks the following: `}
                        <br />
                        <br />
                        {howToEnterChallengeModeText(true)}
                    </span>
                )}
            </p>
            <h3 className="subtitle subtitleColor">
                How strong is the effect of Challenge Mode?
            </h3>
            <p>
                {challengeModeModifierText(completeFinchesCode)}
                {isMentor && !completeFinchesCode && (
                    <span className="mentorHax">
                        <br />
                        {`This info is unlocked by "The Finches Code, Decoded" and unlocks the following: `}
                        <br />
                        <br />
                        {challengeModeModifierText(true)}
                    </span>
                )}
            </p>
        </div>
    );
};

export default ChallengeModeInfo;
