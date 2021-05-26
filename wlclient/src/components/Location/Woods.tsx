import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions, itemDetails } from 'wlcommon';
import { makeActionProps, PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.WOODS.GET_HAIR]: new PlayerAction("Get Hair", "It is said that a herd of unicorns live in the Whispering Woods, and they only appear to the pure of heart. Fortunately, we only need to find the hair that they shed.", 
        "Share a point in time when you received help and support from others to receive 1 X Unicorn Hair. Your mentors will decide how many of you needs to share.", "703px", "382px",
        undefined,
        (playerState) => !(playerState.inventory[itemDetails.UNICORN_HAIR.id]?.qty || playerState.inventory[itemDetails.UNICORN_TEAR.id]?.qty)
                                                              )
}

const Woods = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;

    const actionProps = makeActionProps(
        actions, isMentor, playerState, handleAction, triggerTooltip
    );
    
    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('woods.png')} />
            {actionProps.map((info: ActionProps, level) => {
                return <Action key={level} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Woods;
