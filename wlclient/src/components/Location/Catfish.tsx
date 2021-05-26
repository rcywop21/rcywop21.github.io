import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { DynamicPlayerAction, makeActionProps, makeDynamicActionProps, PlayerAction } from '../../PlayerAction';
import DynamicAction, { DynamicActionProps } from './DynamicAction';

const Catfish = (props: SpecificLocationProps): React.ReactElement => {
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
            "No task required.", "169px", "348px"),
        [Actions.ALL_OXYGEN.GET_OXYGEN]: new DynamicPlayerAction("Get Oxygen", "The Oxygen Stream at Catfish Crescent is curiously linked with the one located at Salmon Street. Both need to be activated at roughly the same time, before you can receive 40 minutes of Oxygen." + coolDownMessage, 
            "Recite Red Cross Promise.", "558px", "152px",
            (playerState) => playerState.streamCooldownExpiry[playerState.locationId] ? new Date(playerState.streamCooldownExpiry[playerState.locationId]) : new Date(0),
            0,
            (setIsVisible, setIsEnabled): void => { setIsEnabled(true);},
            (setIsVisible, setIsEnabled): void => { setIsEnabled(false);},)
    }

    const actionProps = makeActionProps(
        actions, isMentor, playerState, handleAction, triggerTooltip
    );
    
    const dynamicActionProps = makeDynamicActionProps(
        actions, isMentor, playerState, handleAction, triggerTooltip
    );
    
    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('catfish.png')} />
            {actionProps.map((info: ActionProps, index) => {
                return <Action key={index} {...info} />;
            })}
            {dynamicActionProps.map((info: DynamicActionProps, index) => {
                return <DynamicAction key={index} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Catfish;
