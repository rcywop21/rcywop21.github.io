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
    [Actions.ALL_UNDERWATER.RESURFACE]: {
        description:
            'Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!',
        task: 'No task required.',
    },
};

const Shallows = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;

    const locationId = Locations.locationIds.SHALLOWS;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo =
        Actions.actionsByLocation[Locations.locationIds.SHALLOWS];
    const actionPositions: string[][] = [
        ['870px', '488px'],
        ['870px', '543px'],
        ['45px', '120px'],
    ];
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
            <img src={imgDirectoryGenerator('shallows.png')} />
            {actionProps.map((info: ActionProps) => {
                return <Action key="" {...info} />;
            })}
        </React.Fragment>
    );
};

export default Shallows;
