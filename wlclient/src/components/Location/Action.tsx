import React from 'react';
import './Action.css';

export interface ActionProps {
    action: string;
    x: string;
    y: string;
    handleAction: () => void;
}

export const Action = (props: ActionProps): React.ReactElement => {
    const { action, x, y, handleAction } = props;
    
    const position = {
        top: y,
        left: x
    };

    return (
        <div
            className="action"
            style={position}
            onClick={handleAction}
        >
            <p>{action}</p>
        </div>
    );
}

export default Action;