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
    [Actions.specificActions.KELP.EXPLORE]: {
        description:
            "The Kelp Plains is full of seaweed, and stretches for miles and miles, and is full of seaweed. Perhaps you can find what you're looking for here.",
        task: 'Use 5 minutes of Oxygen.',
    },
    [Actions.specificActions.KELP.CLIMB_DOWN]: {
        description:
            'You have found a small shrine tucked away in a valley. However, the journey there looks difficult.',
        task:
            'Online Maze: https://www.mathsisfun.com/games/mazes.html. Complete one Hard maze.',
    },
    [Actions.specificActions.KELP.HARVEST]: {
        description: 'Harvest some blinkseed here.',
        task:
            'Have a member receive a message from the mentors. The rest of you have to lipread what he/she is saying.',
    },
};

const Kelp = (props: SpecificLocationProps): React.ReactElement => {
    const { state, handleAction } = props;

    const locationId = Locations.locationIds.KELP;
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = Actions.actionsByLocation[locationId];
    const actionPositions: string[][] = [
        ['73px', '347px'],
        ['360px', '487px'],
        ['510px', '284px'],
        ['870px', '488px'],
        ['870px', '543px'],
        ['122px', '117px'],
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
            <img src={imgDirectoryGenerator('kelp.png')} />
            {actionProps.map((info: ActionProps) => {
                return <Action key="" {...info} />;
            })}
        </React.Fragment>
    );
};

export default Kelp;
