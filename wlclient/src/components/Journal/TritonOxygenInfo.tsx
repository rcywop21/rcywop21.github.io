import React from 'react';
import { GlobalState, Locations, Util } from 'wlcommon';
import OxygenEntry, { ChallengeModeParameter } from './OxygenInfo';

export interface TritonOxygenInfoProps {
    tritonOxygen: GlobalState['tritonOxygen'];
    cooldown?: Date;
    challengeMode: ChallengeModeParameter;
}

const TritonOxygenInfo = (props: TritonOxygenInfoProps): React.ReactElement => {
    const { tritonOxygen, ...other } = props;

    const [availableOxygen, setAvailableOxygen] = React.useState<number>(0);

    const lastTeam = tritonOxygen.lastTeam === undefined ? 'an unknown person' : 'Team ' + tritonOxygen.lastTeam.toString();

    React.useEffect(() => {
        const interval = setInterval(() => {
            setAvailableOxygen(Date.now() - new Date(tritonOxygen.lastExtract).valueOf());
        }, 25);
        return () => clearInterval(interval);
    }, [tritonOxygen]);

    return (<OxygenEntry 
        locationId={Locations.locationIds.STATUE}
        addendum={<div className="addendum">The Statue of Triton has accumulated {Util.formatDuration(availableOxygen)} of Oxygen. It was last extracted by {lastTeam}.</div>}
        oxygenInSeconds={availableOxygen / 10000}
        {...other}
    />);
}

export default TritonOxygenInfo;
