import React from 'react';
import { Action } from 'wlcommon';
import './OnActionPopup.css';

export interface OnActionPopupProps {
    action: Action | null;
    priority?: boolean;
    isMentor?: boolean;
    mentorProps?: OnActionPopupMentorProps;
}

export interface OnActionPopupMentorProps {
    handleActionApprove: () => void;
    handleActionReject: () => void;
}

const OnActionPopup = (props: OnActionPopupProps): React.ReactElement => {
    const { action, priority, isMentor, mentorProps } = props;
    
    if (!action || (isMentor && action === "pause")) {
        return <React.Fragment></React.Fragment>;
    }
    
    if (isMentor && mentorProps) {
        const { handleActionApprove, handleActionReject } = mentorProps;
        return (
            <React.Fragment>
                <div className="onActionPopup">
                    <h2>Performing Action...</h2>
                    <p>Your group is currently performing an action: {action}</p>
                    <p>Approve?</p>
                    <button onClick={handleActionApprove}>Yes</button>
                    <button onClick={handleActionReject}>No</button>
                </div>
                <div className="onActionBackgroundShroud"></div>
            </React.Fragment>
        );
    }
    
    let popupText: React.ReactElement;
    if (action === "pause") {
        popupText = (
            <React.Fragment>
                <h2>Pause</h2>
                <p>Your mentor has paused the exercise.</p>
                <p>Please wait for your mentor to resume...</p>
            </React.Fragment>
        );
    } else {
        popupText = (
            <React.Fragment>
                <h2>Performing Action...</h2>
                <p>You are currently performing an action: {action}</p>
                <p>Please wait for mentor approval...</p>
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