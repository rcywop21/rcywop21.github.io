import React from 'react';
import { PlayerState, GlobalState, questIds, QuestId } from 'wlcommon';
import './Journal.css';
import './ChallengeModeInfo.css';

export interface ChallengeModeInfoProps {
    playerState: PlayerState;
    globalState: GlobalState;
}

const ChallengeModeInfo = (props: ChallengeModeInfoProps): React.ReactElement => {
    const { playerState, globalState } = props;
    
    function isQuestComplete(id: QuestId): boolean {
        return playerState.quests[id] && playerState.quests[id].status === "completed";
    }
    
    const completeShrine = isQuestComplete(questIds.SHRINE_1);
    const completeFinchesCode = isQuestComplete(questIds.FINCHES_2);
    
    const howToEnterChallengeModeText = completeShrine
        ? "Challenge Mode begins when you dive into the Undersea while holding Unicorn's Hair. "
            + "It ends when you leave the Undersea, or when you complete the full duration of the challenge."
        : "You have not found out how to enter challenge mode yet. "
            + "Perhaps someone with more mystical knowledge can help you?";
            
    const challengeModeModifierText = completeFinchesCode
        ? "Challenge mode initially causes you to only gain 15% of what you would normally gain "
            + "(i.e. Diving gives you 3 min of oxygen rather than 20 min). "
            + "However, powerful magical artefacts are able to counteract the effects of challenge mode. "
            + "For each artefact (except the first, which has no effect) found by any group, "
            + "You will be able to gain an additional 2.5% of expected oxygen during challenge mode. "
            + "E.g. With 5 artefacts found, diving will give you 5 min of oxygen during challenge mode. "
        : "You have not found out how exactly does challenge mode affect your oxygen gain. "
            + "Perhaps it will be written down in some ancient tome? ";
            
    const currentlyInChallengeModeText = playerState.challengeMode ? (
        <React.Fragment>
            <h3 className="subtitle challengeColor">You are currently in challenge mode!</h3>
            <p>Challenge Mode will end at {playerState.challengeMode.toString().slice(11, 19)}</p>
            <p>With {globalState.artefactsFound} artefacts found, the current oxygen modifier is 
                {` ${Math.max(150, 125 + 25 * globalState.artefactsFound)/10}%`}. </p>
        </React.Fragment>
    ) : <React.Fragment></React.Fragment>;
    
    return (
        <div>
            <h2 className="journalTitle">CHALLENGE MODE INFO</h2>
            <p className="helptext">This page contains information 
                you have uncovered about Challenge Mode.</p>
            {currentlyInChallengeModeText}
            <h3 className="subtitle subtitleColor">What is challenge mode?</h3>
            <p> During challenge mode, you will only receive a much reduced amount of Oxygen from diving and from Oxygen Streams.
                If you have an Oxygen Pump, it will not be able to function for the duration of challenge mode. 
                Challenge mode lasts for 30 minutes.</p>
            <h3 className="subtitle subtitleColor">How do you enter challenge mode?</h3>
            <p>{howToEnterChallengeModeText}</p>
            <h3 className="subtitle subtitleColor">How strong is the effect of challenge mode?</h3>
            <p>{challengeModeModifierText}</p>
        </div>
    );
}

export default ChallengeModeInfo;