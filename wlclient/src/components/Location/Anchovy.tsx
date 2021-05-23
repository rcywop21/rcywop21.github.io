import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.ANCHOVY.EXPLORE]: new PlayerAction("Anchovy Avenue is a residential district. The Chief Librarian of the Marine Library is said to live here.", 
        "Use 5 minutes of Oxygen.", "466px", "354px"),
    [Actions.specificActions.ANCHOVY.INSPIRE]: new PlayerAction("Inspire the Chief Librarian with your leadership!", 
        "Have any member of your team perform Project Inspire.", "294px", "533px"),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px"),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px"),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "209px", "120px")
}

const Anchovy = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction } = props;

    if (playerState.storedOxygen == null) {
        actions[Actions.ALL_UNDERWATER.STORE_OXYGEN].isVisible = false;
        actions[Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN].isVisible = false;
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
            
            