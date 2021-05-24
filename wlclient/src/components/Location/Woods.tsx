import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.WOODS.GET_HAIR]: new PlayerAction("It is said that a herd of unicorns live in the Whispering Woods, and they only appear to the pure of heart. Fortunately, we only need to find the hair that they shed.", 
        "Share a point in time when you received help and support from others to receive 1 X Unicorn Hair.", "703px", "382px")
}

const Woods = (props: SpecificLocationProps): React.ReactElement => {
    const { handleAction, triggerTooltip } = props;

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
            <img src={imgDirectoryGenerator('woods.png')} />
            {actionProps.map((info: ActionProps) => {
                return <Action key="" {...info} />;
            })}
        </React.Fragment>
    );
};

export default Woods;
