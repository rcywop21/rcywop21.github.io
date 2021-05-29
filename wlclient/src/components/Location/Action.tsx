import React from 'react';
import { useLongPress } from 'use-long-press';
import { isMobileDevice } from '../../util';
import { tooltipTypes, TooltipType, TooltipData } from '../Popups/Tooltip';
import './Action.css';

export interface ActionProps {
    display: string;
    action: string;
    x: string;
    y: string;
    isVisible: boolean;
    isEnabled: boolean;
    handleAction: () => void;
    triggerTooltip: (
        t?: TooltipType,
        d?: TooltipData,
        b?: boolean
    ) => () => void;
    tooltipInfo: TooltipData;
}

export const Action = (props: ActionProps): React.ReactElement => {
    const {
        display,
        x,
        y,
        isVisible,
        isEnabled,
        handleAction,
        triggerTooltip,
        tooltipInfo,
    } = props;
    
    const isTooltipRightSide = x.length < 5 || x < '512px';
    
    const handleLongPress = useLongPress(
        triggerTooltip(
                tooltipTypes.ACTION,
                tooltipInfo ? tooltipInfo : ['derp', '', ''],
                isTooltipRightSide
            )
    );

    const position = {
        top: y,
        left: x,
        display: isVisible ? '' : 'none',
    };
    
    const tooltipHandlers = isMobileDevice()
        ? {...handleLongPress}
        : {
            onMouseEnter: triggerTooltip(
                tooltipTypes.ACTION,
                tooltipInfo ? tooltipInfo : ['derp', '', ''],
                isTooltipRightSide
            ),
            onMouseLeave: triggerTooltip()
        };

    return (
        <div
            className={`action ${isEnabled ? 'enabled' : 'disabled'}`}
            style={position}
            onClick={isEnabled ? handleAction : undefined}
            {...tooltipHandlers}
        >
            <p>{display}</p>
        </div>
    );
};

export default Action;
