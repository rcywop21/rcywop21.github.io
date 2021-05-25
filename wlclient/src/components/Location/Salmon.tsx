import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions, questIds } from 'wlcommon';
import { DynamicPlayerAction, PlayerAction } from '../../PlayerAction';
import DynamicAction, { DynamicActionProps } from './DynamicAction';

const Salmon = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;

    const coolDownMessage = playerState.streamCooldownExpiry[playerState.locationId]
        ? " You may reuse this service again at " + new Date(playerState.streamCooldownExpiry[playerState.locationId]).toLocaleTimeString()
        : "";

    const actions: Record<string, PlayerAction> = {
        [Actions.specificActions.SALMON.EXPLORE]: new DynamicPlayerAction("Salmon Street is a residential district. It was built around an Oxygen Stream located here.", 
            "Use 5 minutes of Oxygen.", "578px", "362px",
            (playerState) => playerState.oxygenUntil ? new Date(playerState.oxygenUntil) : new Date(0),
            300000,
            (setIsVisible, setIsEnabled): void => { setIsEnabled(false); },
            (): void => { return; },),
        [Actions.specificActions.SALMON.CONFRONT]: new PlayerAction("The children are chasing each other with the long and pointy stick. Tell them what is right.", 
            "Have any member of your team perform Project MTW.", "142px", "542px",
            (playerState) => playerState.quests[questIds.ARGUMENT]?.status === 'incomplete'),
        [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
            "No task required.", "870px", "488px",
            (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
        [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw all Oxygen from your Oxygen Pump.", 
            "No task required.", "870px", "543px",
            (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
        [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
            "No task required.", "18px", "96px"),
        [Actions.ALL_OXYGEN.GET_OXYGEN]: new DynamicPlayerAction("The Oxygen Stream at Salmon Street is curiously linked with the one located at Catfish Crescent. Both need to be activated at roughly the same time, before you can receive 40 minutes of Oxygen." + coolDownMessage, 
            "Recite Red Cross Promise.", "827px", "127px",
            (playerState) => playerState.streamCooldownExpiry[playerState.locationId] ? new Date(playerState.streamCooldownExpiry[playerState.locationId]) : new Date(0),
            0,
            (setIsVisible, setIsEnabled): void => { setIsEnabled(true);},
            (setIsVisible, setIsEnabled): void => { setIsEnabled(false);},)
    }

    const actionProps = Object.entries(actions)
        .filter(([, playerAction]) => !(playerAction instanceof DynamicPlayerAction))
        .map(([actionId, playerAction]) => ({
            action: actionId,
            x: playerAction.x,
            y: playerAction.y,
            isVisible: isMentor ? 
                true :
                playerAction.getVisibility ? 
                    playerAction.getVisibility(playerState) : 
                    true,
            isEnabled: playerAction.getVisibility ? 
                playerAction.getVisibility(playerState) : true &&
                playerAction.getEnabled ? playerAction.getEnabled(playerState) : true,
            handleAction: handleAction(actionId),
            triggerTooltip: triggerTooltip,
            tooltipInfo: [actionId, playerAction.description, playerAction.task]
    }));
    
    const dynamicActionProps = Object.entries(actions)
        .filter(([, playerAction]) => playerAction instanceof DynamicPlayerAction)
        .map(([actionId, playerAction]) => {
            const dynamicPlayerAction = playerAction as DynamicPlayerAction;
            return {
                actionProps: {
                    action: actionId,
                    x: dynamicPlayerAction.x,
                    y: dynamicPlayerAction.y,
                    isVisible: isMentor ? 
                        true :
                        dynamicPlayerAction.getVisibility ? 
                            dynamicPlayerAction.getVisibility(playerState) : 
                            true,
                    isEnabled: dynamicPlayerAction.getVisibility ? 
                        dynamicPlayerAction.getVisibility(playerState) : true &&
                        dynamicPlayerAction.getEnabled ? dynamicPlayerAction.getEnabled(playerState) : true,
                    handleAction: handleAction(actionId),
                    triggerTooltip: triggerTooltip,
                    tooltipInfo: [actionId, dynamicPlayerAction.description, dynamicPlayerAction.task]
                },
                timeToCompare: dynamicPlayerAction.timeToCompare(playerState),
                howRecentToTrigger: dynamicPlayerAction.howRecentToTrigger,
                triggerEffectsIfRecent: dynamicPlayerAction.triggerEffectsIfRecent,
                triggerEffectsIfNotRecent: dynamicPlayerAction.triggerEffectsIfNotRecent
            };
        });
    
    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('corals.png')} />
            {actionProps.map((info: ActionProps, index) => {
                return <Action key={index} {...info} />;
            })}
            {dynamicActionProps.map((info: DynamicActionProps, index) => {
                return <DynamicAction key={index} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Salmon;
