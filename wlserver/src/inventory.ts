import { ItemId } from 'wlcommon';
import { Transform } from './stateMgr';

export const makeAddItemTransform = (
    itemId: ItemId,
    qty: number
): Transform => (state) => ({
    ...state,
    playerState: {
        ...state.playerState,
        inventory: {
            ...state.playerState.inventory,
            [itemId]: {
                item: itemId,
                qty: (state.playerState.inventory[itemId]?.qty ?? 0) + qty,
            },
        },
    },
});

export const makeRemoveItemTransform = (
    itemId: ItemId,
    qty: number
): Transform => (state) => {
    const oldRecord = state.playerState.inventory[itemId];
    if (oldRecord && oldRecord.qty >= qty) {
        return {
            ...state,
            playerState: {
                ...state.playerState,
                inventory: {
                    ...state.playerState.inventory,
                    [itemId]: {
                        qty: oldRecord.qty - qty,
                        item: itemId,
                    },
                },
            },
        };
    }

    throw 'Not enough items in inventory to remove.';
};
