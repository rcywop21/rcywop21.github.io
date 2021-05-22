import React from 'react';
import { Action, ActionProps } from './Action';
import {
    SpecificLocationProps,
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
    [Actions.specificActions.ALCOVE.RETRIEVE_PEARL]: {
        description: "You know what you're here for.",
        task: 'Receive 1 x Pearl of Asclepius.',
    },
};

const Alcove = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;

    const locationId = Locations.locationIds.ALCOVE;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[locationId];
    const actionPositions: string[][] = [
        ['409px', '399px'],
        ['870px', '488px'],
        ['870px', '543px'],
        ['729px', '101px'],
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
            <img src={imgDirectoryGenerator('alcove.png')} />
            {actionProps.map((info: ActionProps) => {
                return <Action key="" {...info} />;
            })}
        </React.Fragment>
    );
};

export default Alcove;
