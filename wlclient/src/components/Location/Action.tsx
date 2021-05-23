import React from 'react';
import './Action.css';

export interface ActionProps {
    action: string;
    x: string;
    y: string;
    isVisible: boolean;
    isEnabled: boolean;
    handleAction: () => void;
}

export const Action = (props: ActionProps): React.ReactElement => {
    const { action, x, y, isVisible, isEnabled, handleAction } = props;
    
    const position = {
        top: y,
        left: x,
        display: isVisible ? "" : "none"
    };

    return (
        <div
            className={`action ${isEnabled ? "enabled" : "disabled"}`} 
            style={position}
            onClick={isEnabled ? handleAction : undefined}
        >
            <p>{action}</p>
        </div>
    );
}

export default Action;