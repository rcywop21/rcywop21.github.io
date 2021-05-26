/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { Action, PlayerState } from 'wlcommon';
import { allPlayerActions } from '../../PlayerAction';
import './OnActionPopup.css';

export interface OnActionPopupProps {
    action: Action | null;
    playerState: PlayerState;
    priority?: boolean;
    isMentor?: boolean;
    mentorProps?: OnActionPopupMentorProps;
}

export interface OnActionPopupMentorProps {
    handleActionApprove: () => void;
    handleActionReject: () => void;
}

const OnActionPopup = (props: OnActionPopupProps): React.ReactElement => {
    const { action, playerState, priority, isMentor, mentorProps } = props;
    
    if (!action || (isMentor && action === "pause")) {
        return <React.Fragment></React.Fragment>;
    }
    if (isMentor && mentorProps) {
        const { handleActionApprove, handleActionReject } = mentorProps;
        return (
            <React.Fragment>
                <div className={`onActionPopup ${priority ? "priorityLayer" : "normalLayer"}`}>
                    <h2 className="status">Performing Action...</h2>
                    <div className="popupText">
                        <p>Your group is currently performing an action: {allPlayerActions[playerState.locationId][playerState.stagedAction!].display}</p>
                        <p>Task Required: {allPlayerActions[playerState.locationId][playerState.stagedAction!].task}</p>
                        <p>Approve?</p>
                        <div>
                            <button onClick={handleActionApprove}>Yes</button>
                            <button onClick={handleActionReject}>No</button>
                        </div>
                    </div>
                </div>
                <div className="onActionBackgroundShroud"></div>
            </React.Fragment>
        );
    }
    
    let popupText: React.ReactElement;
    if (action === "pause") {
        popupText = (
            <React.Fragment>
                <h2 className="status">Pause</h2>
                <div className="popupText">
                    <p>Your mentor has paused the exercise.</p>
                    <p>Please wait for your mentor to resume...</p>
                </div>
            </React.Fragment>
        );
    } else {
        popupText = (
            <React.Fragment>
                <h2 className="status">Performing Action...</h2>
                <div className="popupText">
                    <p>You are currently performing an action: {allPlayerActions[playerState.locationId][playerState.stagedAction!].display}</p>
                    <p>Task Required: {allPlayerActions[playerState.locationId][playerState.stagedAction!].task}</p>
                    <p>Please wait for mentor approval...</p>
                </div>
            </React.Fragment>
        );
    }
    
    return (
        <React.Fragment>
            <div className={`onActionPopup ${priority ? "priorityLayer" : "normalLayer"}`}>
                {popupText}
            </div>
            <div className="onActionBackgroundShroud"></div>
        </React.Fragment>
    );
}

export default OnActionPopup;