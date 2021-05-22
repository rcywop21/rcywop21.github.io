import React from 'react';
import './InventoryItem.css';

export interface InventoryItemProps {
    name: string;
}

const INVENTORY_ITEMS_ASSET_MAP: Map<string, string> = new Map([
    ["map", "world-map.png"]
]);

function getImg(item: string): string {
    const imgFileName = INVENTORY_ITEMS_ASSET_MAP.get(item);
    
    if (!imgFileName) {
        return "";
    }
    
    const imgFileDirectory = "/assets/inventory/";

    return imgFileDirectory + imgFileName;
}
    

const InventoryItem = (props: InventoryItemProps): React.ReactElement => {
    const { name } = props;
    
    return (
        <div className="inventoryItem">
            <img src={getImg(name)} />
            <br />
            <span>{name}</span>
        </div>
    );
}

export default InventoryItem;