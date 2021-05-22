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
    [Actions.ALL_OXYGEN.GET_OXYGEN]: {
        description:
            'There is a small oxygen stream at the Memorial Corals. By Undersea law, after topping up Oxygen, you must wait 5 minutes before you can top up Oxygen at the same Oxygen Stream.',
        task:
            'Each person has to present a fully filled water bottle to the mentors to receive 20 minutes of Oxygen.',
    },
    [Actions.specificActions.CORALS.EXPLORE]: {
        description:
            'The Memorial Corals is a location of historical importance. There are various exhibits in the park. You can spend some time to look around the exhibits.',
        task: 'Use 5 minutes of Oxygen.',
    },
    [Actions.specificActions.CORALS.LEARN_LANG]: {
        description:
            'The ancient language of the Undersea is interesting. Devote some time to learning it.',
        task:
            "Gather items: 2 brushes, 2 pieces of paper, 2 storybooks; Each person then has to say 'hi' in a different language and say what language it is.",
    },
};

const Corals = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;

    const locationId = Locations.locationIds.CORALS;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[locationId];
    const actionPositions: string[][] = [
        ['743px', '265px'],
        ['427px', '419px'],
        ['870px', '488px'],
        ['870px', '543px'],
        ['26px', '106px'],
        ['108px', '438px'],
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
            <img src={imgDirectoryGenerator('corals.png')} />
            {actionProps.map((info: ActionProps) => {
                return <Action key="" {...info} />;
            })}
        </React.Fragment>
    );
};

export default Corals;
