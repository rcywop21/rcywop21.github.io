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
    [Actions.specificActions.ANCHOVY.EXPLORE]: { description: "Talk to the librarians about the Marine Library.", 
                                                 task: "Use 5 minutes of Oxygen."},
    [Actions.specificActions.ANCHOVY.INSPIRE]: { description: "Inspire the Chief Librarian with your leadership!", 
                                                 task: "Have any member of your team perform Project Inspire."},
}

const Anchovy = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;
    
    const locationId = Locations.locationIds.ANCHOVY;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[locationId];
    const actionPositions: string[][] = [
        ["466px", "354px"],
        ["294px", "533px"],
        ["870px", "488px"],
        ["870px", "543px"],
        ["209px", "120px"]
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
            <img src={imgDirectoryGenerator("anchovy4.png")} />
            { actionProps.map((info: ActionProps) => {
                return (<Action 
                    key="" 
                    {...info} 
                />)}) }
        </React.Fragment>
    );
}

export default Anchovy;
            
            