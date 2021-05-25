import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions, itemDetails, questIds } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.UMBRAL.EXPLORE]: new PlayerAction("This is a shady, run-down area. Apparently it used to be a residential district, but the Oxygen Stream here vanished one day, suddenly. You shudder as you walk around the area.", 
        "Use 5 minutes of Oxygen.", "656px", "402px"),
    [Actions.specificActions.UMBRAL.GIVE_PAN]: new PlayerAction("Give Alyusi the Pyrite Pan.", 
        "Give 1 x Pyrite Pan.", "579px", "197px",
        (playerState) => playerState.quests[questIds.CLOAK_2]?.status === 'incomplete',
        (playerState) => playerState.inventory[itemDetails.PYRITE_PAN.id] !== null),
    [Actions.specificActions.UMBRAL.GIVE_ROCK]: new PlayerAction("Give Alyusi the Chmyrrkyth.", 
        "Give 1 x Mysterious Black Rock.", "749px", "177px",
        (playerState) => playerState.quests[questIds.CLOAK_1]?.status === 'incomplete',
        (playerState) => playerState.inventory[itemDetails.BLACK_ROCK.id] !== null),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "60px", "304px")
}

const Umbral = (props: SpecificLocationProps): React.ReactElement => {
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
            <img src={imgDirectoryGenerator('umbral.png')} />
            {actionProps.map((info: ActionProps, level) => {
                return <Action key={level} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Umbral;
