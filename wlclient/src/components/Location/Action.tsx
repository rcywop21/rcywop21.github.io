import React from 'react';
import './Action.css';

export interface ActionProps {
    action: string;
    x: string;
    y: string;
}

const Action = (props: ActionProps): React.ReactElement => {
    const { action, x, y } = props;
    
    const position = {
        top: y,
        left: x
    };
    
    function handleClick(): void {
        const doNothing = 1 + 2;
        return;
    }
    
    return (
        <div
            className="action"
            style={position}
            onClick={handleClick}
        >
            <p>{action}</p>
        </div>
    );
}

export default Action;