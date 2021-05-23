import React from 'react';
import { itemsById } from 'wlcommon';
import './Tooltip.css';

export interface TooltipProps {
    isVisible: boolean;
    tooltipType: TooltipType;
    data: string;
}

export const tooltipTypes = {
    NONE: null,
    INVENTORY: "inventory",
    ACTION: "action"
} as const;

export type TooltipType = (typeof tooltipTypes)[keyof typeof tooltipTypes];

const Tooltip = (props: TooltipProps): React.ReactElement => {
    const { isVisible, tooltipType, data } = props;
    
    let title = "";
    let details = "";
    
    if (!tooltipType) {
        return <React.Fragment></React.Fragment>
    }
    
    if (tooltipType === tooltipTypes.INVENTORY) {
        const itemData = itemsById[data];
        title = itemData.name;
        details = itemData.description;
    }
    
    const style = {
        display: isVisible ? "" : "none"
    }
    
    const testText = "Return to Sleepy Shore. Note that when you return to the surface, all your oxygen will be lost as it escapes into the air!";
    
    return (
        <div className="tooltip" style={style}>
            <h2 className="tooltipTitle">{title}</h2>
            <p className="tooltipText">{details}</p>
        </div>
    );
}

export default Tooltip;