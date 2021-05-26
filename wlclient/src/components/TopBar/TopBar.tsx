import React from 'react';
import InventoryItem from './InventoryItem';
import Timer from './Timer';
import { TooltipType } from '../Popups/Tooltip';
import { ItemId, ItemRecord } from 'wlcommon';
import './TopBar.css';

export interface TopBarProps {
    inventory: Record<ItemId, ItemRecord>;
    oxygenUntil: Date | null;
    challengeMode: Date | null;
    crimsonUntil: Date;
    triggerTooltip: (t?:TooltipType, d?:string[]) => () => void;
}

const TopBar = (props: TopBarProps): React.ReactElement => {
    const { inventory, oxygenUntil, triggerTooltip, challengeMode } = props;
    const quantifiedInventory: ItemId[] = [];
    Object.values(inventory).forEach((record: ItemRecord): void => {
        for (let i = 0; i < record.qty; i++) {
            quantifiedInventory.push(record.item);
        }
    });
    
    return (
        <div className="topBar">
            <div className="inventory">
                { quantifiedInventory.map((item: ItemId, index) => { 
                    return (
                        <InventoryItem 
                            key={index} 
                            name={item}
                            triggerTooltip={triggerTooltip}
                        />
                    )
                }) }
            </div>
            <div className="timers">
                {oxygenUntil && <Timer name="oxygen" until={oxygenUntil} />}
                {challengeMode && <Timer name="crimson" until={challengeMode} />}
                {/*<Timer name="crimson" time={crimsonTime} />*/}
            </div>
        </div>
    );
};

export default TopBar;
