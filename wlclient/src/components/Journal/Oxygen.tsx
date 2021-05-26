import React from 'react';
import { Locations, PlayerState, GlobalState } from 'wlcommon';
import LinkedOxygenInfo from './LinkedOxygenInfo';
import './Oxygen.css';
import OxygenEntry, { ChallengeModeParameter } from './OxygenInfo';
import TritonOxygenInfo from './TritonOxygenInfo';

export interface OxygenProps {
    playerState: PlayerState;
    globalState: GlobalState;
}

const getChallengeModeParameter = (playerState: PlayerState, globalState: GlobalState): ChallengeModeParameter => {
    if (!playerState.challengeMode)
        return null;
    if (!playerState.knowsCrimson)
        return 'vague';
    return Math.max(0.15, 0.125 + 0.025 * globalState.artefactsFound);
}

const Oxygen = (props: OxygenProps): React.ReactElement => {
    const { playerState, globalState } = props;
    
    const challengeModeParameter = getChallengeModeParameter(playerState, globalState);
    
    return (
        <div className="oxygen-journal">
            <h2 className="journalTitle">OXYGEN INFO</h2>
            <p className= "helptext">Here&apos;s information regarding the oxygen streams. Note that after using an Oxygen Stream, you must wait 10 minutes before you can use the <b>same</b> Oxygen Stream again.</p>
            <OxygenEntry 
                locationId={Locations.locationIds.CORALS} 
                actionKey="corals"
                cooldown={new Date(playerState.streamCooldownExpiry[Locations.locationIds.CORALS])}
                challengeMode={challengeModeParameter}
                oxygenInSeconds={1200}
                />
            <OxygenEntry 
                locationId={Locations.locationIds.TUNA} 
                actionKey="tuna"
                cooldown={new Date(playerState.streamCooldownExpiry[Locations.locationIds.TUNA])}
                challengeMode={challengeModeParameter}
                oxygenInSeconds={1800}
                />
            <OxygenEntry 
                locationId={Locations.locationIds.BUBBLE} 
                actionKey="bubble"
                cooldown={new Date(playerState.streamCooldownExpiry[Locations.locationIds.BUBBLE])}
                enabled={!!playerState.hasBubblePass}
                disabledDescription="You need a Bubble Pass to use this Oxygen Stream."
                challengeMode={challengeModeParameter}
                oxygenInSeconds={2400}
                />
            <LinkedOxygenInfo
                actionKey="salmon"
                playerState={playerState}
                otherStreamState={globalState.linkedStreams.lastCatfish}
                otherStreamLastId={globalState.linkedStreams.lastCatfishId}
                challengeMode={challengeModeParameter}
            />
            <LinkedOxygenInfo
                actionKey="catfish"
                playerState={playerState}
                otherStreamState={globalState.linkedStreams.lastSalmon}
                otherStreamLastId={globalState.linkedStreams.lastSalmonId}
                challengeMode={challengeModeParameter}
            />
            <TritonOxygenInfo
                tritonOxygen={globalState.tritonOxygen}
                cooldown={new Date(playerState.streamCooldownExpiry[Locations.locationIds.STATUE])}
                challengeMode={challengeModeParameter}
            />
        </div>
    );
}

export default Oxygen;
