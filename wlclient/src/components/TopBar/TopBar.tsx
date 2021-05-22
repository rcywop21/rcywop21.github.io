import React from 'react';
import InventoryItem from './InventoryItem';
import Timer from './Timer';
import './TopBar.css';

export interface TopBarProps {
    inventory: string[];
    oxygenUntil: Date | null;
    crimsonUntil: Date;
}

const TopBar = (props: TopBarProps): React.ReactElement => {
    const { inventory, oxygenUntil } = props;

    return (
        <div className="topBar">
            <div className="inventory">
                {inventory.map((item: string) => {
                    return <InventoryItem key={item} name={item} />;
                })}
            </div>
            <div className="timers">
                {oxygenUntil && <Timer name="oxygen" until={oxygenUntil} />}
                {/*<Timer name="crimson" time={crimsonTime} />*/}
            </div>
        </div>
    );
};

export default TopBar;
