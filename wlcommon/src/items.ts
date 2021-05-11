export type ItemId = string;

export interface Item {
    id: ItemId;
    name: string;
    description: string;
}

export interface ItemRecord {
    item: Item;
    qty: number;
}
