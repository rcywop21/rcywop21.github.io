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
    [Actions.ALL_OXYGEN.GET_OXYGEN]: {
        description:
            'The Oxygen Stream at Salmon Street is curiously linked with the one located at Catfish Crescent. Both need to be activated at roughly the same time, before you can receive 40 minutes of Oxygen.',
        task: 'Recite Red Cross Promise.',
    },
    [Actions.specificActions.SALMON.EXPLORE]: {
        description:
            'Salmon Street is a residential district. It was built around an Oxygen Stream located here.',
        task: 'Use 5 minutes of Oxygen.',
    },
    [Actions.specificActions.SALMON.CONFRONT]: {
        description:
            'The children are chasing each other with the long and pointy stick. Tell them what is right.',
        task: 'Have any member of your team perform Project MTW.',
    },
};

const Salmon = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;

    const locationId = Locations.locationIds.SALMON;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[locationId];
    const actionPositions: string[][] = [
        ['578px', '362px'],
        ['142px', '542px'],
        ['870px', '488px'],
        ['870px', '543px'],
        ['18px', '96px'],
        ['827px', '127px'],
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
            <img src={imgDirectoryGenerator('salmon.png')} />
            {actionProps.map((info: ActionProps) => {
                return <Action key="" {...info} />;
            })}
        </React.Fragment>
    );
};

export default Salmon;
