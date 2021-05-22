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
    [Actions.specificActions.STORE.BUY_MAP]: { description: "This map will let you find your way to more locations in the Undersea.", 
                                               task: "Pay 5 minutes of Oxygen to receive 1 x Map."},
    [Actions.specificActions.STORE.BUY_GUIDE]: { description: "It's an introduction of all the Oxygen Streams in the Undersea.",
                                                 task: "Pay 5 minutes of Oxygen to receive 1 x Guide to the Oxygen Streams of the Undersea."},
    [Actions.specificActions.STORE.BUY_DOLL]: { description: "It's a doll of The Little Mermaid! How cute UWU.",
                                                task: "Pay 10 minutes of Oxygen to receive 1 x Mermaid Doll."},
    [Actions.specificActions.STORE.BUY_DISCOVERS]: { description: "This ticket lets you go on the full tour of the Statue of Triton.", 
                                                     task: "Pay 20 minutes of Oxygen to receive 1 x UnderseaDiscovers Ticket."},
    [Actions.specificActions.STORE.BUY_PUMP]: { description: "This pump allows you to store all your Oxygen before you resurface, so it doesn't go to waste.", 
                                                task: "Pay 30 minutes of Oxygen to receive 1 x Oxygen Pump."},
    [Actions.specificActions.STORE.BUY_BLACK_ROCK]: { description: "It's a strange looking black rock. There are odd markings on it. Nobody knows what its uses, or properties are...", 
                                                      task: "Pay 30 minutes of Oxygen to receive 1 x Mysterious Black Rock."},
    [Actions.specificActions.STORE.BUY_BUBBLE_PASS]: { description: "This golden pass lets you access the Bubble Factory. It has no expiry date and can be used multiple times.", 
                                                       task: "Pay 40 minutes of Oxygen to receive 1 x Bubble Pass."},                     
}

const Store = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;
    
    const locationId = Locations.locationIds.STORE;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[locationId];
    const actionPositions: string[][] = [
        ["577px", "549px"],
        ["717px", "308px"],
        ["451px", "221px"],
        ["278px", "140px"],
        ["810px", "209px"],
        ["252px", "495px"],
        ["433px", "344px"],
        ["870px", "488px"],
        ["870px", "543px"],
        ["99px", "251px"]
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
            <img src={imgDirectoryGenerator("store.png")} />
            { actionProps.map((info: ActionProps) => {
                return (<Action 
                    key="" 
                    {...info} 
                />)}) }
        </React.Fragment>
    );
}

export default Store;
            
            