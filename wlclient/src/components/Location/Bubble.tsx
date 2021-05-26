import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions, itemDetails } from 'wlcommon';
import { DynamicPlayerAction, makeActionProps, makeDynamicActionProps, PlayerAction } from '../../PlayerAction';
import DynamicAction, { DynamicActionProps } from './DynamicAction';

const Bubble = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;

    const coolDownMessage = playerState.streamCooldownExpiry[playerState.locationId]
        ? " You may reuse this service again at " + new Date(playerState.streamCooldownExpiry[playerState.locationId]).toLocaleTimeString()
        : "";

    const actions: Record<string, PlayerAction> = {
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store Oxygen", "Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
            "No task required.", "870px", "488px",
            (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
        [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw Oxygen", "Withdraw all Oxygen from your Oxygen Pump.", 
            "No task required.", "870px", "543px",
            (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Resurface", "Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
            "No task required.", "434px", "524px"),
        [Actions.ALL_OXYGEN.GET_OXYGEN]: new DynamicPlayerAction("Get Oxygen", "Each of you has to show a different item from the following: Pencil case, phone application and items you bring on a holiday." + coolDownMessage, 
            "Recite Red Cross Promise.", "55px", "239px",
            (playerState) => new Date(playerState.streamCooldownExpiry[playerState.locationId] ?? 0),
            0,
            (setIsVisible, setIsEnabled): void => { setIsEnabled(true);},
            (setIsVisible, setIsEnabled): void => { setIsEnabled(false);}, 
            undefined, (playerState) => playerState.inventory[itemDetails.BUBBLE.id]?.qty > 0)
    }
    
    const actionProps = makeActionProps(
        actions, isMentor, playerState, handleAction, triggerTooltip
    );
    
    const dynamicActionProps = makeDynamicActionProps(
        actions, isMentor, playerState, handleAction, triggerTooltip
    );
    
    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('bubble.png')} />
            {actionProps.map((info: ActionProps, index) => {
                return <Action key={index} {...info} />;
            })}
            {dynamicActionProps.map((info: DynamicActionProps, index) => {
                return <DynamicAction key={index} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Bubble;
