import React from 'react';
import { Action } from 'wlcommon';
import './OnActionPopup.css';

export interface OnActionPopupProps {
    action: Action | null;
}

const OnActionPopup = (props: OnActionPopupProps): React.ReactElement => {
    const { action } = props;
    
    if (!action) {
        return <React.Fragment></React.Fragment>
    }
    
    return (
        <React.Fragment>
            <div className="onActionPopup">
                <h2>Performing Action...</h2>
                <p>You are currently performing an action: {action}</p>
                <p>Please wait for mentor approval</p>
            </div>
            <div className="backgroundShroud"></div>
        </React.Fragment>
    );
}

export default OnActionPopup;