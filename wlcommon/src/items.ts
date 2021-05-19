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

const itemList: Item[] = [
    {
        id: 'Map',
        name: 'Map of the Undersea',
        description:
            'It shows you the way to most of the major locations in the Undersea.',
    },
    {
        id: 'OxygenGuide',
        name: 'Guide to Oxygen Streams',
        description:
            'It describes most of the Oxygen Streams in the Undersea as well as how to get Oxygen from them.',
    },
    {
        id: 'MermaidDoll',
        name: 'Mermaid Doll',
        description: "It's a doll of The Little Mermaid! How cute.",
    },
];

export const items: Record<ItemId, Item> = {};
itemList.forEach((item) => {
    items[item.id] = item;
});
