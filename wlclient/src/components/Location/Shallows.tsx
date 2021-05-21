import React from 'react';
import Action from './Action';
import { SpecificLocationProps, getSpecificLocationComponent, imgDirectoryGenerator } from './LocationComponent';
import { Locations, Actions } from 'wlcommon';
import './Shallows.css';

const Shallows = (props: SpecificLocationProps): React.ReactElement => {
    const { state } = props;
    
    const locationId = Locations.locationIds.SHALLOWS;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[Locations.locationIds.SALMON];
    const actionPositions: string[][] = [
        ["360px", "239px"],
        ["853px", "156px"],
        ["763px", "400px"],
        ["763px", "445px"],
        ["45px", "120px"],
        ["234px", "470px"]
    ];
    for (let i = 0; i < actionsInfo.length; i++) {
        actionPositions[i].push(actionsInfo[i]);
    }
    
    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator("shallows.png")} />
            { actionPositions.map((info: string[]) => {
                return (<Action key="" action={info[2]} x={info[0]} y={info[1]} />)}) }
        </React.Fragment>
    );
}

export default Shallows;
            
            