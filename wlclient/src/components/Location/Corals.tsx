import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.CORALS.EXPLORE]: new PlayerAction("The Memorial Corals is a location of historical importance. There are various exhibits in the park. You can spend some time to look around the exhibits.", 
        "Use 5 minutes of Oxygen.", "743px", "265px"),
    [Actions.specificActions.CORALS.LEARN_LANG]: new PlayerAction("The ancient language of the Undersea is interesting. Devote some time to learning it.", 
        "Gather items: 2 brushes, 2 pieces of paper, 2 storybooks; Each person then has to say 'hi' in a different language and say what language it is.",
        "427px", "419px"),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px"),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px"),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "26px", "106px"),
    [Actions.ALL_OXYGEN.GET_OXYGEN]: new PlayerAction("There is a small oxygen stream at the Memorial Corals. By Undersea law, after topping up Oxygen, you must wait 5 minutes before you can top up Oxygen at the same Oxygen Stream.", 
        "Each person has to present a fully filled water bottle to the mentors to receive 20 minutes of Oxygen.",
        "108px", "438px")
}

const Corals = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip } = props;

    if (playerState.storedOxygen == null) {
        actions[Actions.ALL_UNDERWATER.STORE_OXYGEN].isVisible = false;
        actions[Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN].isVisible = false;
    }
    if (!playerState.quests[21]) {
        actions[Actions.specificActions.CORALS.LEARN_LANG].isVisible = false;
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
            <img src={imgDirectoryGenerator('corals.png')} />
            {actionProps.map((info: ActionProps) => {
                return <Action key="" {...info} />;
            })}
        </React.Fragment>
    );
};

export default Corals;
