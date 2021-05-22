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
