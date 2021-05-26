import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { PlayerAction, DynamicPlayerAction } from '../../PlayerAction';
import DynamicAction, { DynamicActionProps } from './DynamicAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.STORE.BUY_MAP]: new DynamicPlayerAction("Buy Map", "This map will let you find your way to more locations in the Undersea.", 
        "Pay 5 minutes of Oxygen to receive 1 x Map.", "577px", "549px",
        (playerState) => playerState.oxygenUntil ? new Date(playerState.oxygenUntil) : new Date(0),
        300000,
        (setIsVisible, setIsEnabled): void => { setIsEnabled(false); },
        (): void => { return; },
        (playerState) => !playerState.inventory['Map']),
    [Actions.specificActions.STORE.BUY_GUIDE]: new DynamicPlayerAction("Buy Guide", "It's an introduction of all the Oxygen Streams in the Undersea.",
        "Pay 5 minutes of Oxygen to receive 1 x Guide to the Oxygen Streams of the Undersea.", "717px", "308px",
        (playerState) => playerState.oxygenUntil ? new Date(playerState.oxygenUntil) : new Date(0),
        300000,
        (setIsVisible, setIsEnabled): void => { setIsEnabled(false); },
        (): void => { return; },
        (playerState) => !playerState.inventory['OxygenGuide']),
    [Actions.specificActions.STORE.BUY_DOLL]: new DynamicPlayerAction("Buy Doll", "It's a doll of The Little Mermaid! How cute UWU.",
        "Pay 10 minutes of Oxygen to receive 1 x Mermaid Doll.", "451px", "221px",
        (playerState) => playerState.oxygenUntil ? new Date(playerState.oxygenUntil) : new Date(0),
        600000,
        (setIsVisible, setIsEnabled): void => { setIsEnabled(false); },
        (): void => { return; }),
    [Actions.specificActions.STORE.BUY_DISCOVERS]: new DynamicPlayerAction("Buy Ticket", "This ticket lets you go on the full tour of the Statue of Triton.", 
        "Pay 20 minutes of Oxygen to receive 1 x UnderseaDiscovers Ticket.", "278px", "140px",
        (playerState) => playerState.oxygenUntil ? new Date(playerState.oxygenUntil) : new Date(0),
        1200000,
        (setIsVisible, setIsEnabled): void => { setIsEnabled(false); },
        (): void => { return; }),
    [Actions.specificActions.STORE.BUY_PUMP]: new DynamicPlayerAction("Buy Pump", "This pump allows you to store all your Oxygen before you resurface, so it doesn't go to waste.", 
        "Pay 30 minutes of Oxygen to receive 1 x Oxygen Pump.", "810px", "209px",
        (playerState) => playerState.oxygenUntil ? new Date(playerState.oxygenUntil) : new Date(0),
        1800000,
        (setIsVisible, setIsEnabled): void => { setIsEnabled(false); },
        (): void => { return; },
        (playerState) => !playerState.inventory['Pump']),
    [Actions.specificActions.STORE.BUY_BLACK_ROCK]: new DynamicPlayerAction("Buy Rock", "It's a strange looking black rock. There are odd markings on it. Nobody knows what its uses, or properties are...", 
        "Pay 30 minutes of Oxygen to receive 1 x Mysterious Black Rock.", "252px", "495px",
        (playerState) => playerState.oxygenUntil ? new Date(playerState.oxygenUntil) : new Date(0),
        1800000,
        (setIsVisible, setIsEnabled): void => { setIsEnabled(false); },
        (): void => { return; },),
    [Actions.specificActions.STORE.BUY_BUBBLE_PASS]: new DynamicPlayerAction("Buy Bubble Pass", "This golden pass lets you access the Bubble Factory. It has no expiry date and can be used multiple times.", 
        "Pay 40 minutes of Oxygen to receive 1 x Bubble Pass.", "433px", "344px",
        (playerState) => playerState.oxygenUntil ? new Date(playerState.oxygenUntil) : new Date(0),
        2400000,
        (setIsVisible, setIsEnabled): void => { setIsEnabled(false); },
        (): void => { return; },),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store Oxygen", "Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw Oxygen", "Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Resurface", "Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "99px", "251px")
}

const Store = (props: SpecificLocationProps): React.ReactElement => {
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
            <img src={imgDirectoryGenerator('store.png')} />
            {actionProps.map((info: ActionProps, index) => {
                return <Action key={index} {...info} />;
            })}
            {dynamicActionProps.map((info: DynamicActionProps, index) => {
                return <DynamicAction key={index} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Store;
