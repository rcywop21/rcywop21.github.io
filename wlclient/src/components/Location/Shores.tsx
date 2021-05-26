import React from 'react';
import { Action, ActionProps } from './Action';
import { SpecificLocationProps, imgDirectoryGenerator } from './LocationComponent';
import { Actions } from 'wlcommon';
import { makeActionProps, PlayerAction } from '../../PlayerAction';

const actions: Record<string, PlayerAction> = {
    [Actions.specificActions.SHORES.DIVE]: new PlayerAction("Dive", "Dive into the deep, blue sea. After diving, you will enter the Shallows location inside the Undersea. You will start your dive with 20 minutes of Oxygen.", 
        "Create a shape resembling a diving board with all of your arms.", "445px", "309px")
}

const Shores = (props: SpecificLocationProps): React.ReactElement => {
    const { playerState, handleAction, triggerTooltip, isMentor } = props;
    
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
