import React from 'react';
import { tooltipTypes, TooltipType } from '../Popups/Tooltip';
import './Action.css';

export interface ActionProps {
    display: string;
    action: string;
    x: string;
    y: string;
    isVisible: boolean;
    isEnabled: boolean;
    handleAction: () => void;
    triggerTooltip: (t?: TooltipType, d?: string[], b?: boolean) => () => void;
    tooltipInfo: string[];
}

export const Action = (props: ActionProps): React.ReactElement => {
    const { display, action, x, y, isVisible, isEnabled, handleAction, triggerTooltip, tooltipInfo } = props;
    
    const position = {
        top: y,
        left: x,
        display: isVisible ? "" : "none"
    };
    
    const isTooltipRightSide = x.length < 5 || x < "512px";

    return (
        <div
            className={`action ${isEnabled ? "enabled" : "disabled"}`} 
            style={position}
            onClick={isEnabled ? handleAction : undefined}
            onMouseEnter={triggerTooltip(tooltipTypes.ACTION, tooltipInfo ? tooltipInfo : ["derp", "", ""], isTooltipRightSide)}
            onMouseLeave={triggerTooltip()}
        >
            <p>{display}</p>
        </div>
    );
};

export default Action;
