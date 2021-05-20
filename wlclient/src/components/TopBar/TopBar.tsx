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
    
    return (
        <div className="topBar">
            <div className="inventory">
                { inventory.map((item: string) => { return (<InventoryItem key={item} name={item} />)}) }
            </div>
            <div className="timers">
                <Timer name="oxygen" time="2021-05-20-T19:00:00.000+08:00" />
                <Timer name="crimson" time="2021-05-20-T19:05:00.000+08:00" />
            </div>
        </div>
    )
}

export default TopBar;