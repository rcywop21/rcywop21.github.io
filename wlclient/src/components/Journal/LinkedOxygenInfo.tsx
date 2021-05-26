import React from 'react';
import { Locations, PlayerState, TeamId } from 'wlcommon';
import OxygenEntry, { ChallengeModeParameter } from './OxygenInfo';

export interface LinkedOxygenInfoProps {
    actionKey: keyof typeof locationIds;
    playerState: PlayerState;
    otherStreamState?: Date;
    otherStreamLastId?: TeamId;
    challengeMode: ChallengeModeParameter;
}

const locationIds = {
    salmon: Locations.locationIds.SALMON,
    catfish: Locations.locationIds.CATFISH,
}

const LinkedOxygenInfo = (props: LinkedOxygenInfoProps): React.ReactElement => {
    const { actionKey, playerState, otherStreamState, otherStreamLastId, challengeMode } = props;

    const locationId = locationIds[actionKey];

    const [otherEndActivated, setOtherEndActivated] = React.useState<boolean>(false);

    const otherStreamLastActivation = new Date(otherStreamState ?? 0).valueOf();

    React.useEffect(() => {
        console.log(Date.now());
        console.log(otherStreamLastActivation);
        console.log(Date.now() - otherStreamLastActivation);
        if (Date.now() - otherStreamLastActivation < 120000) {
            setOtherEndActivated(true);
            const timeout = setTimeout(() => setOtherEndActivated(false), 120020 - (Date.now() - otherStreamLastActivation))
            return () => clearTimeout(timeout);
        }
    }, [otherStreamLastActivation]);

    return (<OxygenEntry 
        locationId={locationId}
        actionKey={actionKey}
        addendum={
            otherEndActivated && otherStreamLastId !== playerState.id && (<div className="cooldown off-cooldown">One end of the Linked Streams was just activated by Team {otherStreamLastId}. Hurry here to collect Oxygen!</div>)
        }
        cooldown={playerState.streamCooldownExpiry[locationId]}
        challengeMode={challengeMode}
        oxygenInSeconds={2400}
    />)
}

export default LinkedOxygenInfo;
