import React from 'react';
import { useLongPress, LongPressDetectEvents } from 'use-long-press';
import { isMobileDevice } from '../../util';
import { tooltipTypes, TooltipType, TooltipData } from '../Popups/Tooltip';
import { ItemId, itemDetails, itemsById } from 'wlcommon';
import './InventoryItem.css';

export interface InventoryItemProps {
    name: ItemId;
    triggerTooltip: (t?: TooltipType, d?: TooltipData) => () => void;
}

const INVENTORY_ITEMS_ASSET_MAP: Map<ItemId, string> = new Map([
    [itemDetails.MAP.id, 'world-map.png'],
    [itemDetails.OXYGEN_GUIDE.id, 'guide.png'],
    [itemDetails.MERMAID_DOLL.id, 'doll.png'],
    [itemDetails.PUMP.id, 'pump.png'],
    [itemDetails.BLACK_ROCK.id, 'rock.png'],
    [itemDetails.BUBBLE.id, 'pass.png'],
    [itemDetails.DISCOVERS.id, 'ticket.png'],
    [itemDetails.STAFF.id, 'staff.png'],
    [itemDetails.BLINKSEED.id, 'blinkseed.png'],
    [itemDetails.PYRITE_PAN.id, 'pan.png'],
    [itemDetails.LIBRARY_PASS.id, 'library.png'],
    [itemDetails.UNICORN_HAIR.id, 'hair.png'],
    [itemDetails.UNICORN_TEAR.id, 'tear.png'],
    [itemDetails.PEARL.id, 'pearl.png'],
    [itemDetails.ELEPHANT.id, 'elephant.png'],
    [itemDetails.HERRING_CHARM.id, 'herring.png'],
]);

function getImg(item: ItemId): string {
    const imgFileName = INVENTORY_ITEMS_ASSET_MAP.get(item);

    if (!imgFileName) {
        return '';
    }

    const imgFileDirectory = '/assets/inventory/';

    return imgFileDirectory + imgFileName;
}

function doNothing() {
    return ;
}

const InventoryItem = (props: InventoryItemProps): React.ReactElement => {
    const { name, triggerTooltip } = props;

    const triggerTooltipWithData = triggerTooltip(tooltipTypes.INVENTORY, [name]);
    
    const handleLongPress = useLongPress(triggerTooltipWithData);
    
    const tooltipHandlers = isMobileDevice()
        ? {...handleLongPress}
        : {
            onMouseEnter: triggerTooltipWithData,
            onMouseLeave: triggerTooltip()
        };

    return (
        <div
            className="inventoryItem"
            {...tooltipHandlers}
        >
            <img src={getImg(name)} />
            <br />
            <span>{itemsById[name].name}</span>
        </div>
    );
};

export default InventoryItem;
