import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { makeActionProps, allPlayerActions } from '../../PlayerAction';
import { Locations } from 'wlcommon';

const Shores = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;
    
    const actions = allPlayerActions[Locations.locationIds.SHORES];
    
    const actionProps = makeActionProps(
        actions, isMentor, playerState, handleAction, triggerTooltip
    );

    return (
        <React.Fragment>
            <img src={imgDirectoryGenerator('shores.png')} />
            {actionProps.map((info: ActionProps, index) => {
                return <Action key={index} {...info} />;
            })}
        </React.Fragment>
    );
};

export default Shores;
