import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions, itemDetails, questIds } from 'wlcommon';
import { makeActionProps, PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.SHRINE.GIVE_HAIR]: new PlayerAction("Give Hair", "The shrinekeeper says he can transform a Unicorn's Hair into a Unicorn's Tear.", 
        "Give 1 x Unicorn's Hair.", "434px", "449px", undefined,
        (playerState) => !playerState.inventory[itemDetails.UNICORN_HAIR.id]?.qty),
    [Actions.specificActions.SHRINE.COLLECT_HAIR]: new PlayerAction("Collect Tear", "Collect the Unicorn Tear from the Shrine.", 
        "Receive 1 x Unicorn Tear.", "434px", "495px",
        (playerState) => playerState.quests[questIds.SHRINE_2]?.stages[4],
        (playerState) => !(playerState.inventory[itemDetails.UNICORN_TEAR.id]?.qty)),
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: new PlayerAction("Store Oxygen", "Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.", 
        "No task required.", "870px", "488px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: new PlayerAction("Withdraw Oxygen", "Withdraw all Oxygen from your Oxygen Pump.", 
        "No task required.", "870px", "543px",
        (playerState) => playerState.storedOxygen !== null && playerState.challengeMode !== null),
    [Actions.ALL_UNDERWATER.RESURFACE]: new PlayerAction("Resurface", "Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!",
        "No task required.", "52px", "123px")
}

const Shrine = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;

    const actionProps = makeActionProps(
        actions, isMentor, playerState, handleAction, triggerTooltip
    );

    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('shrine.png')} />
            {actionProps.map((info: ActionProps, level) => {
                return <Action key={level} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Shrine;
