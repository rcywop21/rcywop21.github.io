import React from 'react';
import InventoryItem from './InventoryItem';
import Timer from './Timer';
import { ItemId, ItemRecord } from 'wlcommon';
import './TopBar.css';

export interface TopBarProps {
    inventory: Record<ItemId, ItemRecord>;
    oxygenUntil: Date | null;
    crimsonUntil: Date;
}

const TopBar = (props: TopBarProps): React.ReactElement => {
    const { inventory, oxygenUntil } = props;
    const quantifiedInventory: ItemId[] = [];
    Object.values(inventory).forEach((record: ItemRecord): void => {
        for (let i = 0; i < record.qty; i++) {
            quantifiedInventory.push(record.item);
        }
    });
    
    return (
        <div className="topBar">
            <div className="inventory">
                { quantifiedInventory.map((item: ItemId) => { return (<InventoryItem key={item} name={item} />)}) }
            </div>
            <div className="timers">
                {oxygenUntil && <Timer name="oxygen" until={oxygenUntil} />}
                {/*<Timer name="crimson" time={crimsonTime} />*/}
            </div>
        </div>
    )
}

export default TopBar;
