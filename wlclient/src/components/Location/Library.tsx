import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions, itemDetails, questIds } from 'wlcommon';
import { DynamicPlayerAction, PlayerAction } from '../../PlayerAction';
import DynamicAction, { DynamicActionProps } from './DynamicAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.LIBRARY.EXPLORE]: new DynamicPlayerAction("Talk to the librarians about the Marine Library.", 
        "Use 5 minutes of Oxygen.", "432px", "385px",
        (playerState) => playerState.oxygenUntil ? new Date(playerState.oxygenUntil) : new Date(0),
        300000,
        (setIsVisible, setIsEnabled): void => { setIsEnabled(false); },
        (): void => { return; },),
    [Actions.specificActions.LIBRARY.STUDY_CRIMSON]: new PlayerAction("Learn more about the Crimson, a crisis that took place 10,000 years ago.", 
        "Have any member share an incident when things did not go as planned for a training/ project and how did the plan get adapted.", "99px", "503px",
        (playerState) => playerState.quests[questIds.FINCHES_2]?.status === 'incomplete',
        (playerState) => playerState.inventory[itemDetails.LIBRARY_PASS.id] !== undefined),
    [Actions.specificActions.LIBRARY.STUDY_ARTEFACT]: new PlayerAction("Learn more about the artefacts.", 
        "Create a new group cheer and do it to energise yourselves.", "630px", "202px",
        (playerState) => playerState.quests[questIds.ARTEFACTS_1]?.status === 'incomplete',
        (playerState) => playerState.inventory[itemDetails.LIBRARY_PASS.id] !== undefined),
    [Actions.specificActions.LIBRARY.DECODE_ARTEFACT]: new PlayerAction("The artefact legend is written in an ancient language. You will need to decode it before you can understand it.", 
        "Decode 'Hwljaxawv Ljalgf'.", "703px", "265px",
        (playerState) => playerState.quests[questIds.ARTEFACTS_2]?.status === 'incomplete',
        (playerState) => playerState.knowsLanguage),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "33px", "171px")
}

const Library = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;
    
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

export default Library;
