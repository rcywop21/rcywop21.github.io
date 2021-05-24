import React from 'react';
import { tooltipTypes, TooltipType } from '../Popups/Tooltip';
import { ItemId, itemDetails, itemsById } from 'wlcommon';
import './InventoryItem.css';

export interface InventoryItemProps {
    name: ItemId;
    triggerTooltip: (t?: TooltipType, d?: string[]) => () => void;
}

const INVENTORY_ITEMS_ASSET_MAP: Map<ItemId, string> = new Map([
    [itemDetails.MAP.id, "world-map.png"],
    [itemDetails.OXYGEN_GUIDE.id, "guide.png"],
    [itemDetails.MERMAID_DOLL.id, "doll.png"],
    [itemDetails.PUMP.id, "pump.png"],
    [itemDetails.BLACK_ROCK.id, "rock.png"],
    [itemDetails.BUBBLE.id, "pass.png"]
]);

function getImg(item: ItemId): string {
    const imgFileName = INVENTORY_ITEMS_ASSET_MAP.get(item);

    if (!imgFileName) {
        return '';
    }

    const imgFileDirectory = '/assets/inventory/';

    return imgFileDirectory + imgFileName;
}

const InventoryItem = (props: InventoryItemProps): React.ReactElement => {
    const { name, triggerTooltip } = props;
    
    const triggerTooltipWithData = triggerTooltip(tooltipTypes.INVENTORY, [name]);

    return (
        <div 
            className="inventoryItem" 
            onMouseEnter={triggerTooltipWithData} 
            onMouseLeave={triggerTooltip()}
        >
            <img src={getImg(name)} />
            <br />
            <span>{itemsById[name].name}</span>
        </div>
    );
};

export default InventoryItem;
