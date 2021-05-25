import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.BARNACLE.EXPLORE]: new PlayerAction("Barnacle Residences is a residential district. The Pyrite Lady is said to live here.", 
        "Use 5 minutes of Oxygen.", "445px", "211px"),
    [Actions.specificActions.BARNACLE.HELP]: new PlayerAction("The Pyrite Lady has mixed up some of her potion ingredients. Help her!", 
        "Create a list of youngest to oldest of your whole group.", "437px", "471px"),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px"),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px"),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "729px", "113px")
}

const Barnacle = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip } = props;
    
    if (playerState.storedOxygen == null) {
        actions[Actions.ALL_UNDERWATER.STORE_OXYGEN].isVisible = false;
        actions[Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN].isVisible = false;
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
        actions[Actions.specificActions.BARNACLE.EXPLORE].isEnabled = false;
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
            <img src={imgDirectoryGenerator('barnacle.png')} />
            {actionProps.map((info: ActionProps) => {
                return <Action key="" {...info} />;
            })}
        </React.Fragment>
    );
};

export default Barnacle;
