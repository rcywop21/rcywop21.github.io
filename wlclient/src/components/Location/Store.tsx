import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.STORE.BUY_MAP]: new PlayerAction("This map will let you find your way to more locations in the Undersea.", 
        "Pay 5 minutes of Oxygen to receive 1 x Map.", "577px", "549px"),
    [Actions.specificActions.STORE.BUY_GUIDE]: new PlayerAction("It's an introduction of all the Oxygen Streams in the Undersea.",
        "Pay 5 minutes of Oxygen to receive 1 x Guide to the Oxygen Streams of the Undersea.", "717px", "308px"),
    [Actions.specificActions.STORE.BUY_DOLL]: new PlayerAction("It's a doll of The Little Mermaid! How cute UWU.",
        "Pay 10 minutes of Oxygen to receive 1 x Mermaid Doll.", "451px", "221px"),
    [Actions.specificActions.STORE.BUY_DISCOVERS]: new PlayerAction("This ticket lets you go on the full tour of the Statue of Triton.", 
        "Pay 20 minutes of Oxygen to receive 1 x UnderseaDiscovers Ticket.", "278px", "140px"),
    [Actions.specificActions.STORE.BUY_PUMP]: new PlayerAction("This pump allows you to store all your Oxygen before you resurface, so it doesn't go to waste.", 
        "Pay 30 minutes of Oxygen to receive 1 x Oxygen Pump.", "810px", "209px"),
    [Actions.specificActions.STORE.BUY_BLACK_ROCK]: new PlayerAction("It's a strange looking black rock. There are odd markings on it. Nobody knows what its uses, or properties are...", 
        "Pay 30 minutes of Oxygen to receive 1 x Mysterious Black Rock.", "252px", "495px"),
    [Actions.specificActions.STORE.BUY_BUBBLE_PASS]: new PlayerAction("This golden pass lets you access the Bubble Factory. It has no expiry date and can be used multiple times.", 
        "Pay 40 minutes of Oxygen to receive 1 x Bubble Pass.", "433px", "344px"),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px"),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px"),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "99px", "251px")
}

const Store = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip } = props;

    if (playerState.storedOxygen == null) {
        actions[Actions.ALL_UNDERWATER.STORE_OXYGEN].isVisible = false;
        actions[Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN].isVisible = false;
    }
    if (playerState.inventory['Map']?.qty) {
        actions[Actions.specificActions.STORE.BUY_MAP].isVisible = false;
    }
    if (playerState.inventory['OxygenGuide']?.qty) {
        actions[Actions.specificActions.STORE.BUY_GUIDE].isVisible = false;
    }
    if (playerState.inventory['Pump']?.qty) {
        actions[Actions.specificActions.STORE.BUY_PUMP].isVisible = false;
    }

    const UPDATE_INTERVAL = 1000 / 10;
    const [timeLeft, setTimeLeft] = React.useState(
        playerState.oxygenUntil
            ? new Date(playerState.oxygenUntil).valueOf() - Date.now()
            : playerState.pausedOxygen
                ? playerState.pausedOxygen
                : 0
    );

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(playerState.oxygenUntil 
                ? new Date(playerState.oxygenUntil).valueOf() - Date.now()
                : playerState.pausedOxygen
                    ? playerState.pausedOxygen
                    : 0);
        }, UPDATE_INTERVAL);
        return () => clearInterval(timer);
    }, [setTimeLeft, UPDATE_INTERVAL, playerState.oxygenUntil, playerState.pausedOxygen]);

    if (timeLeft < 300000 ) {
        actions[Actions.specificActions.STORE.BUY_MAP].isEnabled = false;
        actions[Actions.specificActions.STORE.BUY_GUIDE].isEnabled = false;
    }
    if (timeLeft < 600000 ) {
        actions[Actions.specificActions.STORE.BUY_DOLL].isEnabled = false;
    }
    if (timeLeft < 1200000 ) {
        actions[Actions.specificActions.STORE.BUY_DISCOVERS].isEnabled = false;
    }
    if (timeLeft < 1800000 ) {
        actions[Actions.specificActions.STORE.BUY_PUMP].isEnabled = false;
        actions[Actions.specificActions.STORE.BUY_BLACK_ROCK].isEnabled = false;
    }
    if (timeLeft < 2400000 ) {
        actions[Actions.specificActions.STORE.BUY_BUBBLE_PASS].isEnabled = false;
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
            handleAction: handleAction(key),
            triggerTooltip: triggerTooltip,
            tooltipInfo: [key, playerAction.description, playerAction.task]
        }
        actionProps.push(currActionProps);
    }

    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('store.png')} />
            {actionProps.map((info: ActionProps) => {
                return <Action key="" {...info} />;
            })}
        </React.Fragment>
    );
};

export default Store;
