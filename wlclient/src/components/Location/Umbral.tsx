import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Locations, Actions } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: { description: "Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
                                             task: "No task required."},
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: { description: "Withdraw all Oxygen from your Oxygen Pump.", 
                                                task: "No task required."},
    [Actions.specificActions.UMBRAL.EXPLORE]: { description: "This is a shady, run-down area. Apparently it used to be a residential district, but the Oxygen Stream here vanished one day, suddenly. You shudder as you walk around the area.", 
                                                task: "Use 5 minutes of Oxygen."},
    [Actions.specificActions.UMBRAL.GIVE_PAN]: { description: "Give Alyusi the Pyrite Pan.", 
                                                 task: "Give 1 x Pyrite Pan."},
    [Actions.specificActions.UMBRAL.GIVE_ROCK]: { description: "Give Alyusi the Chmyrrkyth.", 
                                                  task: "Give 1 x Mysterious Black Rock."},
}

const Umbral = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;
    
    const locationId = Locations.locationIds.UMBRAL;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[locationId];
    const actionPositions: string[][] = [
        ["656px", "402px"],
        ["579px", "197px"],
        ["749px", "177px"],
        ["870px", "488px"],
        ["870px", "543px"],
        ["60px", "304px"]
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
            <img src={imgDirectoryGenerator("umbral.png")} />
            { actionProps.map((info: ActionProps) => {
                return (<Action 
                    key="" 
                    {...info} 
                />)}) }
        </React.Fragment>
    );
}

export default Umbral;
            
            