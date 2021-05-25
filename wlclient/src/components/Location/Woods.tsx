import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.WOODS.GET_HAIR]: new PlayerAction("Get Hair", "It is said that a herd of unicorns live in the Whispering Woods, and they only appear to the pure of heart. Fortunately, we only need to find the hair that they shed.", 
        "Share a point in time when you received help and support from others to receive 1 X Unicorn Hair.", "703px", "382px")
}

const Woods = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;

    const actionProps = Object.entries(actions).map(([actionId, playerAction]) => ({
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
        tooltipInfo: [actionId, playerAction.description, playerAction.task]
    }));

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
