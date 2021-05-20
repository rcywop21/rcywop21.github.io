import React from 'react';
import InventoryItem from './InventoryItem';
import Timer from './Timer';
import './TopBar.css';

export interface TopBarProps {
    inventory: string[];
    oxygenLeft: number;
    oxygenRate: number;
    crimsonTime: string;
}

const TopBar = (props: TopBarProps): React.ReactElement => {
    const { inventory, oxygenLeft, oxygenRate, crimsonTime } = props;
    
    //timer processing
    const oxygenTime = new Date(Date.now() + oxygenLeft * 1000 / oxygenRate).toISOString();
    
    
    return (
        <div className="topBar">
            <div className="inventory">
                { inventory.map((item: string) => { return (<InventoryItem key={item} name={item} />)}) }
            </div>
            <div className="timers">
                <Timer name="oxygen" time={oxygenTime} />
                <Timer name="crimson" time={crimsonTime} />
            </div>
        </div>
    )
}

export default TopBar;