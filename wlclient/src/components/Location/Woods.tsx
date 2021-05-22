import React from 'react';
import { Action, ActionProps } from './Action';
import {
    SpecificLocationProps,
    getSpecificLocationComponent,
    imgDirectoryGenerator,
} from './LocationComponent';
import { Locations, Actions } from 'wlcommon';
import { PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.ALL_UNDERWATER.STORE_OXYGEN]: {
        description:
            'Store all your Oxygen (except 2 mins, enough for you to resurface) into your Oxygen Pump.',
        task: 'No task required.',
    },
    [Actions.ALL_UNDERWATER.WITHDRAW_OXYGEN]: {
        description: 'Withdraw all Oxygen from your Oxygen Pump.',
        task: 'No task required.',
    },
    [Actions.specificActions.WOODS.GET_HAIR]: {
        description:
            'It is said that a herd of unicorns live in the Whispering Woods, and they only appear to the pure of heart. Fortunately, we only need to find the hair that they shed.',
        task:
            'Share a point in time when you received help and support from others to receive 1 X Unicorn Hair.',
    },
};

const Woods = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;

    const locationId = Locations.locationIds.WOODS;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[locationId];
    const actionPositions: string[][] = [['703px', '382px']];
    const actionProps: ActionProps[] = [];
    for (let i = 0; i < actionsInfo.length; i++) {
        const currActionProps: ActionProps = {
            action: actionsInfo[i],
            x: actionPositions[i][0],
            y: actionPositions[i][1],
            handleAction: handleAction(actionsInfo[i]),
        };
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
