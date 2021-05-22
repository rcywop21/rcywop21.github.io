import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, getSpecificLocationComponent, imgDirectoryGenerator } from './LocationComponent';
import { Locations, Actions } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: { description: "Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
                                             task: "No task required."},
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: { description: "Withdraw all Oxygen from your Oxygen Pump.", 
                                                task: "No task required."},
    [Actions.specificActions.LIBRARY.EXPLORE]: { description: "Talk to the librarians about the Marine Library.", 
                                                 task: "Use 5 minutes of Oxygen."},
    [Actions.specificActions.LIBRARY.STUDY_CRIMSON]: { description: "Learn more about the Crimson, a crisis that took place 10,000 years ago.", 
                                                       task: "Have any member share an incident when things did not go as planned for a training/ project and how did the plan get adapted."},
    [Actions.specificActions.LIBRARY.STUDY_ARTEFACT]: { description: "Learn more about the artefacts.", 
                                                        task: "Create a new group cheer and do it to energise yourselves."},
    [Actions.specificActions.LIBRARY.DECODE_ARTEFACT]: { description: "The artefact legend is written in an ancient language. You will need to decode it before you can understand it.", 
                                                         task: "Decode 'Hwljaxawv Ljalgf'."},                                       
}

const Library = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;
    
    const locationId = Locations.locationIds.LIBRARY;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[locationId];
    const actionPositions: string[][] = [
        ["432px", "385px"],
        ["99px", "503px"],
        ["630px", "202px"],
        ["703px", "265px"],
        ["870px", "488px"],
        ["870px", "543px"],
        ["33px", "171px"]
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
            <img src={imgDirectoryGenerator("library.png")} />
            { actionProps.map((info: ActionProps) => {
                return (<Action 
                    key="" 
                    {...info} 
                />)}) }
        </React.Fragment>
    );
}

export default Library;
            
            