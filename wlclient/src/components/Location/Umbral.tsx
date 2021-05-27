import React from 'react';
import { Action, ActionProps } from './Action';
import {
    SpecificLocationProps,
    imgDirectoryGenerator,
} from './LocationComponent';
import {
    makeActionProps,
    makeDynamicActionProps,
    allPlayerActions,
} from '../../PlayerAction';
import DynamicAction, { DynamicActionProps } from './DynamicAction';
import { Locations } from 'wlcommon';

const Umbral = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;

    const actions = allPlayerActions[Locations.locationIds.TUNA];

    const actionProps = makeActionProps(
        actions,
        isMentor,
        playerState,
        handleAction,
        triggerTooltip
    );

    const dynamicActionProps = makeDynamicActionProps(
        actions,
        isMentor,
        playerState,
        handleAction,
        triggerTooltip
    );

    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('umbral.png')} />
            {actionProps.map((info: ActionProps, index) => {
                return <Action key={index} {...info} />;
            })}
            {dynamicActionProps.map((info: DynamicActionProps, index) => {
                return <DynamicAction key={index} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Umbral;
