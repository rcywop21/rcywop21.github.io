export type ItemId = string;

export interface Item {
    id: ItemId;
    name: string;
    description: string;
}

export interface ItemRecord {
    item: ItemId;
    qty: number;
}

export const itemDetails = {
    MAP: {
        id: 'Map',
        name: 'Map of the Undersea',
        description:
            'It shows you the way to most of the major locations in the Undersea.',
    },
    OXYGEN_GUIDE: {
        id: 'OxygenGuide',
        name: 'Guide to Oxygen Streams',
        description:
            'It describes most of the Oxygen Streams in the Undersea as well as how to get Oxygen from them.',
    },
    MERMAID_DOLL: {
        id: 'MermaidDoll',
        name: 'Mermaid Doll',
        description: "It's a doll of The Little Mermaid! How cute.",
    },
    PUMP: {
        id: 'Pump',
        name: 'Oxygen Pump',
        description:
            "This pump allows you to store all your Oxygen before you resurface, so it doesn't go to waste.",
    },
    BLACK_ROCK: {
        id: 'BlackRock',
        name: 'Mysterious Black Rock',
        description:
            "It's a strange looking black rock. There are odd markings on it. Nobody knows what its uses, or properties are...",
    },
    BUBBLE: {
        id: 'BubblePass',
        name: 'Bubble Pass',
        description:
            'This golden pass lets you access the Bubble Factory. It has no expiry date and can be used multiple times.',
    },
    DISCOVERS: {
        id: 'Discovers',
        name: 'UnderseaDiscovers Ticket',
        description:
            "It's a tourist pass to the Statue of Triton! With this ticket, you get close-up access to more parts of the Statue.",
    },
    BLINKSEED: {
        id: 'Blinkseed',
        name: 'Blinkseed Blades',
        description:
            "You harvested this from Kelp Plains. It looks like seaweed leaves, but Alyusi insists that it's blinkseed.",
    },
    PYRITE_PAN: {
        id: 'PyritePan',
        name: 'Pyrite Pan',
        description:
            "It's a pan made of pyrite, a mineral also known as fool's gold.",
    },
    LIBRARY_PASS: {
        id: 'LibraryPass',
        name: 'Library Pass',
        description: "It lets you read books from the Restricted Section of the Marine Library. The Chief Librarian has the authority to bestow it on individuals she deems worthy."
    },
    UNICORN_HAIR: {
        id: 'UnicornHair',
        name: "Unicorn's Hair",
        description: 'The hair of a Unicorn. WARNING: Performing a dive with this in your inventory will put you in Challenge Mode. In Challenge Mode, any oxygen you gain from diving or Oxygen Streams will be halved.',
    },
    UNICORN_TEAR: {
        id: 'UnicornTear',
        name: "Unicorn Tear",
        description: 'An incredibly valuable artefact. When mixed with the proper reagents, it can help cure any degree of exhaustion.',
    },
    PEARL: {
        id: 'Pearl',
        name: "Pearl of Asclepius",
        description: 'An incredibly valuable artefact. Fashioned by the legendary healer Asclepius, a skilled healer can use this to heal someone of almost any kind of ailment.',
    }
};

export const itemsById: Record<ItemId, Item> = {};
Object.values(itemDetails).forEach((item) => {
    itemsById[item.id] = item;
});
