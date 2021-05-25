import React from 'react';
import DynamicAction from './DynamicAction';
import { DynamicActionProps } from './DynamicAction';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.STORE.BUY_MAP]: new PlayerAction("This map will let you find your way to more locations in the Undersea.", 
        "Pay 5 minutes of Oxygen to receive 1 x Map.", "577px", "549px",
        (playerState) => !playerState.inventory['Map']),
    [Actions.specificActions.STORE.BUY_GUIDE]: new PlayerAction("It's an introduction of all the Oxygen Streams in the Undersea.",
        "Pay 5 minutes of Oxygen to receive 1 x Guide to the Oxygen Streams of the Undersea.", "717px", "308px",
        (playerState) => !playerState.inventory['OxygenGuide']),
    [Actions.specificActions.STORE.BUY_DOLL]: new PlayerAction("It's a doll of The Little Mermaid! How cute UWU.",
        "Pay 10 minutes of Oxygen to receive 1 x Mermaid Doll.", "451px", "221px"),
    [Actions.specificActions.STORE.BUY_DISCOVERS]: new PlayerAction("This ticket lets you go on the full tour of the Statue of Triton.", 
        "Pay 20 minutes of Oxygen to receive 1 x UnderseaDiscovers Ticket.", "278px", "140px"),
    [Actions.specificActions.STORE.BUY_PUMP]: new PlayerAction("This pump allows you to store all your Oxygen before you resurface, so it doesn't go to waste.", 
        "Pay 30 minutes of Oxygen to receive 1 x Oxygen Pump.", "810px", "209px",
        (playerState) => !playerState.inventory['Pump']),
    [Actions.specificActions.STORE.BUY_BLACK_ROCK]: new PlayerAction("It's a strange looking black rock. There are odd markings on it. Nobody knows what its uses, or properties are...", 
        "Pay 30 minutes of Oxygen to receive 1 x Mysterious Black Rock.", "252px", "495px"),
    [Actions.specificActions.STORE.BUY_BUBBLE_PASS]: new PlayerAction("This golden pass lets you access the Bubble Factory. It has no expiry date and can be used multiple times.", 
        "Pay 40 minutes of Oxygen to receive 1 x Bubble Pass.", "433px", "344px"),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "99px", "251px")
}

const Store = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;
    
    const testDynamicActionProps: DynamicActionProps = {
        actionProps: actionProps.filter((ap) => ap.action === Actions.specificActions.STORE.BUY_MAP)[0],
        timeToCompare: playerState.oxygenUntil ? new Date(playerState.oxygenUntil!) : new Date(0),
        howRecentToTrigger: 300000,
        triggerEffectsIfRecent: (setIsVisible, setIsEnabled): void => {
            setIsEnabled(false);
        },
        triggerEffectsIfNotRecent: (setIsVisible, setIsEnabled): void => {
            return;
        }
    }

    const actionProps = Object.entries(actions).map(([actionId, playerAction]) => ({
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

    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('store.png')} />
            <DynamicAction {...testDynamicActionProps} />
            {/*actionProps.map((info: ActionProps) => {
                return <Action key="" {...info} />;
            })*/}
        </React.Fragment>
    );
};

export default Store;
