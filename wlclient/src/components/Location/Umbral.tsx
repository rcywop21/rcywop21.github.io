import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.UMBRAL.EXPLORE]: new PlayerAction("This is a shady, run-down area. Apparently it used to be a residential district, but the Oxygen Stream here vanished one day, suddenly. You shudder as you walk around the area.", 
        "Use 5 minutes of Oxygen.", "656px", "402px"),
    [Actions.specificActions.UMBRAL.GIVE_PAN]: new PlayerAction("Give Alyusi the Pyrite Pan.", 
        "Give 1 x Pyrite Pan.", "579px", "197px"),
    [Actions.specificActions.UMBRAL.GIVE_ROCK]: new PlayerAction("Give Alyusi the Chmyrrkyth.", 
        "Give 1 x Mysterious Black Rock.", "749px", "177px"),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px"),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px"),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "60px", "304px")
}

const Umbral = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction } = props;

    if (playerState.storedOxygen == null) {
        actions[Actions.ALL_UNDERWATER.STORE_OXYGEN].isVisible = false;
        actions[Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN].isVisible = false;
    }
    if (!playerState.inventory['PyritePan']?.qty) {
        actions[Actions.specificActions.UMBRAL.GIVE_PAN].isEnabled = false;
    }
    if (!playerState.inventory['BlackRock']?.qty) {
        actions[Actions.specificActions.UMBRAL.GIVE_ROCK].isEnabled = false;
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
            <img src={imgDirectoryGenerator('umbral.png')} />
            {actionProps.map((info: ActionProps) => {
                return <Action key="" {...info} />;
            })}
        </React.Fragment>
    );
};

export default Umbral;
