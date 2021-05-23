import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.LIBRARY.EXPLORE]: new PlayerAction("Talk to the librarians about the Marine Library.", 
        "Use 5 minutes of Oxygen.", "432px", "385px"),
    [Actions.specificActions.LIBRARY.STUDY_CRIMSON]: new PlayerAction("Learn more about the Crimson, a crisis that took place 10,000 years ago.", 
        "Have any member share an incident when things did not go as planned for a training/ project and how did the plan get adapted.", "99px", "503px"),
    [Actions.specificActions.LIBRARY.STUDY_ARTEFACT]: new PlayerAction("Learn more about the artefacts.", 
        "Create a new group cheer and do it to energise yourselves.", "630px", "202px"),
    [Actions.specificActions.LIBRARY.DECODE_ARTEFACT]: new PlayerAction("The artefact legend is written in an ancient language. You will need to decode it before you can understand it.", 
        "Decode 'Hwljaxawv Ljalgf'.", "703px", "265px"),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px"),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px"),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "33px", "171px")
}

const Library = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction } = props;
    
    if (playerState.storedOxygen == null) {
        actions[Actions.ALL_UNDERWATER.STORE_OXYGEN].isVisible = false;
        actions[Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN].isVisible = false;
    }
    if (!playerState.knowsLanguage) {
        actions[Actions.specificActions.LIBRARY.DECODE_ARTEFACT].isEnabled = false;
    }

    const actionProps: ActionProps[] = [];
    for (const key in actions) {
        const playerAction = actions[key];
        const currActionProps: ActionProps = {
            action: key,
            x: playerAction.x,
            y: playerAction.y,
            isVisible: playerAction.isVisible,
            isEnabled: playerAction.isEnabled,
            handleAction: handleAction(key)
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
            
            