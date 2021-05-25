import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions, questIds } from 'wlcommon';
import { DynamicPlayerAction, PlayerAction } from '../../PlayerAction';
import DynamicAction, { DynamicActionProps } from './DynamicAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.KELP.EXPLORE]: new DynamicPlayerAction("Explore", "The Kelp Plains is full of seaweed, and stretches for miles and miles, and is full of seaweed. Perhaps you can find what you're looking for here.", 
        "Use 5 minutes of Oxygen.", "73px", "347px",
        (playerState) => playerState.oxygenUntil ? new Date(playerState.oxygenUntil) : new Date(0),
        300000,
        (setIsVisible, setIsEnabled): void => { setIsEnabled(false); },
        (): void => { return; },),
    [Actions.specificActions.KELP.CLIMB_DOWN]: new PlayerAction("Climb Down", "You have found a small shrine tucked away in a valley. However, the journey there looks difficult.", 
        "Online Maze: https://www.mathsisfun.com/games/mazes.html. Complete one Hard maze.", "360px", "487px",
        (playerState) => playerState.quests[questIds.SHRINE_1]?.status === 'incomplete'),
    [Actions.specificActions.KELP.HARVEST]: new PlayerAction("Harvest", "Harvest some blinkseed here.", 
        "Have a member receive a message from the mentors. The rest of you have to lipread what he/she is saying.", "510px", "284px"),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store Oxygen", "Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw Oxygen", "Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Resurface", "Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "122px", "117px")
}

const Kelp = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;

    const actionProps = Object.entries(actions)
        .filter(([, playerAction]) => !(playerAction instanceof DynamicPlayerAction))
        .map(([actionId, playerAction]) => ({
            display: playerAction.display,
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
            tooltipInfo: [playerAction.display, playerAction.description, playerAction.task]
    }));
    
    const dynamicActionProps = Object.entries(actions)
        .filter(([, playerAction]) => playerAction instanceof DynamicPlayerAction)
        .map(([actionId, playerAction]) => {
            const dynamicPlayerAction = playerAction as DynamicPlayerAction;
            return {
                actionProps: {
                    display: playerAction.display,
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
                    tooltipInfo: [playerAction.display, dynamicPlayerAction.description, dynamicPlayerAction.task]
                },
                timeToCompare: dynamicPlayerAction.timeToCompare(playerState),
                howRecentToTrigger: dynamicPlayerAction.howRecentToTrigger,
                triggerEffectsIfRecent: dynamicPlayerAction.triggerEffectsIfRecent,
                triggerEffectsIfNotRecent: dynamicPlayerAction.triggerEffectsIfNotRecent
            };
        });
    
    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('kelp.png')} />
            {actionProps.map((info: ActionProps, index) => {
                return <Action key={index} {...info} />;
            })}
            {dynamicActionProps.map((info: DynamicActionProps, index) => {
                return <DynamicAction key={index} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Kelp;
