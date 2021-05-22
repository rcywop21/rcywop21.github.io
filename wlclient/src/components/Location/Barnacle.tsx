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
    [Actions.specificActions.BARNACLE.EXPLORE]: { description: "Barnacle Residences is a residential district. The Pyrite Lady is said to live here.", 
                                                  task: "Use 5 minutes of Oxygen."},
    [Actions.specificActions.BARNACLE.HELP]: { description: "The Pyrite Lady has mixed up some of her potion ingredients. Help her!", 
                                               task: "Create a list of youngest to oldest of your whole group."},
}

const Barnacle = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;
    
    const locationId = Locations.locationIds.BARNACLE;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[locationId];
    const actionPositions: string[][] = [
        ["445px", "211px"],
        ["437px", "471px"],
        ["870px", "488px"],
        ["870px", "543px"],
        ["729px", "113px"]
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
            <img src={imgDirectoryGenerator("barnacle.png")} />
            { actionProps.map((info: ActionProps) => {
                return (<Action 
                    key="" 
                    {...info} 
                />)}) }
        </React.Fragment>
    );
}

export default Barnacle;
            
            