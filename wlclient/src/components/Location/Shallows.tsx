import React from 'react';
import { Action, ActionProps } from './Action';
import {
    SpecificLocationProps,
    imgDirectoryGenerator,
} from './LocationComponent';
import { makeActionProps, allPlayerActions } from '../../PlayerAction';
import { Locations } from 'wlcommon';

const Shallows = (props: SpecificLocationProps): React.ReactElement => {
    const {
        playerState,
        handleAction,
        triggerTooltip,
        isMentor,
        globalState,
    } = props;

    const actions = allPlayerActions[Locations.locationIds.SHALLOWS];

    const actionProps = makeActionProps(
        actions,
        isMentor,
        playerState,
        handleAction,
        triggerTooltip,
        globalState
    );

    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('shallows.png')} />
            {actionProps.map((info: ActionProps, index) => {
                return <Action key={index} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Shallows;
