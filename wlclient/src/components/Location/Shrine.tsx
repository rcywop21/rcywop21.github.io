import React from 'react';
import { Action, ActionProps } from './Action';
import {
    SpecificLocationProps,
    imgDirectoryGenerator,
} from './LocationComponent';
import { makeActionProps, allPlayerActions } from '../../PlayerAction';
import { Locations } from 'wlcommon';

const Shrine = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;

    const actions = allPlayerActions[Locations.locationIds.SHRINE];

    const actionProps = makeActionProps(
        actions,
        isMentor,
        playerState,
        handleAction,
        triggerTooltip
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
