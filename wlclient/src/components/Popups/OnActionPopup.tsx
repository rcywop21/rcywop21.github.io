import React from 'react';
import { Action } from 'wlcommon';
import './OnActionPopup.css';

export interface OnActionPopupProps {
    action: Action | null;
    isMentor?: boolean;
    mentorProps?: OnActionPopupMentorProps;
}

export interface OnActionPopupMentorProps {
    handleActionApprove: () => void;
    handleActionReject: () => void;
}

const OnActionPopup = (props: OnActionPopupProps): React.ReactElement => {
    const { action, isMentor, mentorProps } = props;
    
    if (!action) {
        return <React.Fragment></React.Fragment>
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
    
    return (
        <React.Fragment>
            <div className="onActionPopup">
                <h2>Performing Action...</h2>
                <p>You are currently performing an action: {action}</p>
                <p>Please wait for mentor approval</p>
            </div>
            <div className="onActionBackgroundShroud"></div>
        </React.Fragment>
    );
}

export default OnActionPopup;