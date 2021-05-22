import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, getSpecificLocationComponent, imgDirectoryGenerator } from './LocationComponent';
import { Locations, Actions } from 'wlcommon';

const Shallows = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;
    
    const locationId = Locations.locationIds.SHALLOWS;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[Locations.locationIds.SALMON];
    const actionPositions: string[][] = [
        ["360px", "239px"],
        ["853px", "156px"],
        ["870px", "488px"],
        ["870px", "543px"],
        ["45px", "120px"],
        ["234px", "470px"]
    ];
    const actionProps: ActionProps[] = [];
    for (let i = 0; i < actionsInfo.length; i++) {
        const currActionProps: ActionProps = {
            action: actionsInfo[i],
            x: actionPositions[i][0],
            y: actionPositions[i][1],
            handleAction: handleAction(actionsInfo[i])
        }
        actionProps.push(currActionProps);
    }
    
    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator("shallows.png")} />
            { actionProps.map((info: ActionProps) => {
                return (<Action 
                    key="" 
                    {...info} 
                />)}) }
        </React.Fragment>
    );
}

export default Shallows;
            
            