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
    [Actions.ALL_OXYGEN.GET_OXYGEN]: { description: "The Statue of Triton has a publicly-accessible storage of Oxygen, which slowly builds up 4 minutes of Oxygen every minute. You can get all the Oxygen inside this store. Note that this storage is shared between everyone.", 
                                       task: "Conduct a Water Parade to receive all Oxygen stored at the statue."},
    [Actions.specificActions.STATUE.EXPLORE]: { description: "The Statue of Triton is a monument to Triton, famed hero of the Undersea. Walk around the statue to learn more about Triton.", 
                                                task: "Use 5 minutes of Oxygen."},
    [Actions.specificActions.STATUE.DECODE_ENGRAVING]: { description: "You have found an engraving written in the ancient language. Decode it to learn what it says.", 
                                                         task: "Decode 'Vwwh Ujaekgf'"},
    [Actions.specificActions.STATUE.CAST_COOLING_AURA]: { description: "The Crimson's body temperature is kept low as part of its slumber. Prevent it from getting too high!",
                                                          task: "No task required."},
    [Actions.specificActions.STATUE.STRENGTHEN_BEFUDDLEMENT]: { description: "A Befuddlement Spell keeps the Crimson from waking up. However, it may weaken over time, and you will have to strengthen it.",
                                                                task: "Do 10 Jumping Jacks/Buddha Claps."},
    [Actions.specificActions.STATUE.POWER_CONTAINMENT]: { description: "The Containment Arrays attempt to isolate the Crimson so that it doesn't sense the artefacts and awaken. You will need to power it to keep the isolation secure.",
                                                          task: "No task required."},
    [Actions.specificActions.STATUE.PURIFY_CORRUPTION]: { description: "As the Crimson begins to awaken, it will start to corrupt the surroundings. It draws even more power from this corruption. You will need to purify the corruption to keep the Crimson weak.",
                                                          task: "No task required."},                   
}

const Statue = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;
    
    const locationId = Locations.locationIds.STATUE;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[locationId];
    const actionPositions: string[][] = [
        ["256px", "441px"],
        ["250px", "553px"],
        ["414px", "324px"],
        ["125px", "122px"],
        ["376px", "135px"],
        ["100px", "304px"],
        ["870px", "488px"],
        ["870px", "543px"],
        ["689px", "100px"],
        ["826px", "238px"]
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
            <img src={imgDirectoryGenerator("statue.png")} />
            { actionProps.map((info: ActionProps) => {
                return (<Action 
                    key="" 
                    {...info} 
                />)}) }
        </React.Fragment>
    );
}

export default Statue;
            
            