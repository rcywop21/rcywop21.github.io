import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions, itemDetails, questIds } from 'wlcommon';
import { DynamicPlayerAction, makeActionProps, makeDynamicActionProps, PlayerAction } from '../../PlayerAction';
import DynamicAction, { DynamicActionProps } from './DynamicAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.UMBRAL.EXPLORE]: new DynamicPlayerAction("Explore", "This is a shady, run-down area. Apparently it used to be a residential district, but the Oxygen Stream here vanished one day, suddenly. You shudder as you walk around the area.", 
        "Use 5 minutes of Oxygen.", "656px", "402px",
        (playerState) => playerState.oxygenUntil ? new Date(playerState.oxygenUntil) : new Date(0),
        300000,
        (setIsVisible, setIsEnabled): void => { setIsEnabled(false); },
        (): void => { return; },),
    [Actions.specificActions.UMBRAL.GIVE_PAN]: new PlayerAction("Give Pyrite Pan", "Give Alyusi the Pyrite Pan.", 
        "Give 1 x Pyrite Pan.", "579px", "197px",
        (playerState) => playerState.quests[questIds.CLOAK_2]?.status === 'incomplete',
        (playerState) => playerState.inventory[itemDetails.PYRITE_PAN.id] !== undefined),
    [Actions.specificActions.UMBRAL.GIVE_ROCK]: new PlayerAction("Give Rock", "Give Alyusi the Chmyrrkyth.", 
        "Give 1 x Mysterious Black Rock.", "749px", "177px",
        (playerState) => playerState.quests[questIds.CLOAK_1]?.status === 'incomplete',
        (playerState) => playerState.inventory[itemDetails.BLACK_ROCK.id] !== undefined),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store Oxygen", "Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw Oxygen", "Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Resurface", "Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "60px", "304px")
}

const Umbral = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;

    const actionProps = makeActionProps(
        actions, isMentor, playerState, handleAction, triggerTooltip
    );
    
    const dynamicActionProps = makeDynamicActionProps(
        actions, isMentor, playerState, handleAction, triggerTooltip
    );
    
    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('umbral.png')} />
            {actionProps.map((info: ActionProps, index) => {
                return <Action key={index} {...info} />;
            })}
            {dynamicActionProps.map((info: DynamicActionProps, index) => {
                return <DynamicAction key={index} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Umbral;
