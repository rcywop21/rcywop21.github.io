import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions, questIds } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.CORALS.EXPLORE]: new PlayerAction("The Memorial Corals is a location of historical importance. There are various exhibits in the park. You can spend some time to look around the exhibits.", 
        "Use 5 minutes of Oxygen.", "743px", "265px"),
    [Actions.specificActions.CORALS.LEARN_LANG]: new PlayerAction(
        "The ancient language of the Undersea is interesting. Devote some time to learning it.", 
        "Gather items: 2 brushes, 2 pieces of paper, 2 storybooks; Each person then has to say 'hi' in a different language and say what language it is.",
        "427px", "419px",
        (playerState) => playerState.quests[questIds.FINCHES]?.status === 'incomplete'),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "26px", "106px"),
    [Actions.ALL_OXYGEN.GET_OXYGEN]: new PlayerAction("There is a small oxygen stream at the Memorial Corals. By Undersea law, after topping up Oxygen, you must wait 5 minutes before you can top up Oxygen at the same Oxygen Stream.", 
        "Each person has to present a fully filled water bottle to the mentors to receive 20 minutes of Oxygen.",
        "108px", "438px")
}

const Corals = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;

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
            <img src={imgDirectoryGenerator('corals.png')} />
            {actionProps.map((info: ActionProps, index) => {
                return <Action key={index} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Corals;
