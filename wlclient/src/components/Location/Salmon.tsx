import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions, questIds } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.SALMON.EXPLORE]: new PlayerAction("Salmon Street is a residential district. It was built around an Oxygen Stream located here.", 
        "Use 5 minutes of Oxygen.", "578px", "362px"),
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
    [Actions.ALL_OXYGEN.GET_OXYGEN]: new PlayerAction("The Oxygen Stream at Salmon Street is curiously linked with the one located at Catfish Crescent. Both need to be activated at roughly the same time, before you can receive 40 minutes of Oxygen.", 
        "Recite Red Cross Promise.", "827px", "127px")
}

const Salmon = (props: SpecificLocationProps): React.ReactElement => {
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
            <img src={imgDirectoryGenerator('salmon.png')} />
            {actionProps.map((info: ActionProps, level) => {
                return <Action key={level} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Salmon;
