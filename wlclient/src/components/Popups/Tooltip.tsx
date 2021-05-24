import React from 'react';
import { itemsById, Locations } from 'wlcommon';
import './Tooltip.css';

export interface TooltipProps {
    isVisible: boolean;
    tooltipType: TooltipType;
    data: string[];
    isRightSide: boolean;
}

export const tooltipTypes = {
    NONE: null,
    INVENTORY: "inventory",
    ACTION: "action",
    LOCATION: "location"
} as const;

export type TooltipType = (typeof tooltipTypes)[keyof typeof tooltipTypes];

const Tooltip = (props: TooltipProps): React.ReactElement => {
    const { isVisible, tooltipType, data, isRightSide } = props;
    
    let title = "";
    let details = <React.Fragment></React.Fragment>;
    
    if (!tooltipType) {
        return <React.Fragment></React.Fragment>
    }
    
    if (tooltipType === tooltipTypes.INVENTORY) {
        const itemData = itemsById[data[0]];
        title = itemData.name;
        details = <p>itemData.description</p>;
    }
    
    if (tooltipType === tooltipTypes.ACTION) {
        title = data[0];
        details = (
            <React.Fragment>
                <p>{data[1]}</p>
                <p>{data[2]}</p>
            </React.Fragment>
        );
    }
    
    if (tooltipType === tooltipTypes.LOCATION) {
        const locationData = Locations.locationsMapping[data[0]];
        title = locationData.name;
        details = <p>{locationData.description}</p>;
    }
    
    const style = {
        display: isVisible ? "" : "none"
    }
    
    const side = isRightSide ? "rightTooltip" : "leftTooltip";
    
    return (
        <div 
            className={`tooltip ${side}`} 
            style={style}
        >
            <h2 className="tooltipTitle">{title}</h2>
            <div className="tooltipText">{details}</div>
        </div>
    );
}

export default Tooltip;