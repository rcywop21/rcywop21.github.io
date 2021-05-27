export type QuestId = number;
export type QuestStatus = 'completed' | 'incomplete';

export interface Quest {
    id: QuestId;
    name: string;
    when?: string;
    description: string;
    unlocks?: QuestId;
    reward?: string[];
    stages: string[];
    stageOrder: 'inOrder' | 'anyOrder';
}

export interface QuestState {
    id: QuestId;
    status: QuestStatus;
    stages: boolean[];
}

export const questIds = {
    CHAPTER_1: 10,
    CHAPTER_2: 20,
    CHAPTER_3: 40,
    FINCHES: 21,
    FINCHES_2: 22,
    LIBRARIAN_PASS: 23,
    ARTEFACTS_1: 24,
    ARTEFACTS_2: 25,
    ARTEFACTS_3: 26,
    ARGUMENT: 27,
    ARTEFACTS_4: 28,
    SHRINE_1: 29,
    SHRINE_2: 30,
    CLOAK_1: 50,
    PYRITE: 51,
    CLOAK_2: 52,
    CLOAK_3: 53,
};

const questList: Quest[] = [
    {
        id: questIds.CHAPTER_1,
        name: 'Chapter 1: The Seas',
        description:
            'The Queen has fallen deathly ill with a rarely-known disease. The King has therefore tasked several adventuring groups with retrieving two lost healing artefacts from the Undersea. As a newcomer to the Undersea, you will need to learn how to dive, survive in the Undersea and find your way around.',
        unlocks: 20,
        reward: ['20 minutes of Oxygen'],
        stages: [
            "Perform the 'Dive' action at Sleepy Shores to enter the Shallows.",
            "Perform the 'Get Oxygen' action at the Memorial Corals.",
            'Get a Map from the General Store.',
        ],
        stageOrder: 'inOrder',
    },
    {
        id: questIds.CHAPTER_2,
        name: 'Chapter 2: The Search',
        when: 'You received this quest after completing Chapter 1: The Seas.',
        description:
            'Now that you are familiar with how to dive and survive in the Undersea, it is time for you to properly begin your journey. Explore around to find the two legendary artefacts.',
        stages: [
            "Search for a Unicorn's Tear.",
            'Search for a Pearl of Asclepius.',
        ],
        stageOrder: 'anyOrder',
    },
    {
        id: questIds.CHAPTER_3,
        name: 'Chapter 3: The Scent',
        when: 'You received this quest suddenly.',
        description:
            'The waters around you start to turn a faint shade of red... It seems that something is awakening...',
        stages: [
            "As a programme, ensure that the Crimson doesn't awaken until every team has completed Chapter 2.",
        ],
        stageOrder: 'anyOrder',
    },
    {
        id: questIds.FINCHES,
        name: 'The Finches Code',
        when: "You received this quest after performing the action 'Explore' the Memorial Corals.",
        description:
            'The Memorial Corals houses many exhibits, detailing the history of the Undersea civilization. One such exhibit describes a language used by the Undersea a few centuries ago. You have a hunch that knowing this language could help you on your quest.',
        stages: [
            "Perform the 'Learn Language' action to learn the language.",
            'Search for an engraving written in the ancient language.',
            "Perform the 'Decode Engraving' action.",
        ],
        unlocks: questIds.FINCHES_2,
        stageOrder: 'inOrder',
    },
    {
        id: questIds.FINCHES_2,
        name: 'The Finches Code, Decoded',
        when: 'You received this quest after completing The Finches Code.',
        description:
            'The engraving talks about an ancient ritual, known as Challenge Mode, which people from outside the Undersea used to perform in the Undersea. It is said that Triton, who was originally born outside the Undersea, became worthy of acclaim by performing this ritual at the highest difficulty. Those who complete this ritual are said to have received very valuable rewards. Perhaps you could learn more abut Challenge Mode at the Marine Library...',
        stages: [
            'Get the Library Pass from the Chief Librarian',
            "Perform the 'Study Challenge Mode' action at the Marine Library",
        ],
        reward: ['Knowledge on how to pacify the Crimson.'],
        stageOrder: 'inOrder',
    },
    {
        id: questIds.LIBRARIAN_PASS,
        name: "The Librarian's Pass",
        when: "Your received this quest by performing the action 'Explore' at Anchovy Avenue.",
        description:
            'The Chief Librarian lives in Anchovy Avenue, and is always looking to find bright young minds around the world. Impress her, and she will give you a Pass to read in the Restricted Section of the Library.',
        stages: [
            "Perform the 'Inspire Chief Librarian' action at Anchovy Avenue.",
        ],
        reward: ['Library Pass'],
        stageOrder: 'anyOrder',
    },
    {
        id: questIds.ARTEFACTS_1,
        name: 'Artefacts, Part 1',
        when: "You received this quest by performing the action 'Explore' at the Marine Library.",
        description:
            'After checking with the librarians, you learn that the books describing the artefacts you look for are all located in the Restricted Section of the Library. Only the Chief Librarian can give you a pass to enter the Restricted Section. Unfortunately, she is on leave today...',
        stages: [
            'Get the Library Pass from the Chief Librarian.',
            "Perform the 'Study Artefact Legend' action at the Marine Library.",
        ],
        unlocks: questIds.ARTEFACTS_2,
        stageOrder: 'inOrder',
    },
    {
        id: questIds.ARTEFACTS_2,
        name: 'Artefacts, Part 2',
        when: 'You received this quest by completing Artefacts, Part 1.',
        description:
            "It seems that some of the books in the Restricted Section are written in some sort of ancient language. You will need to learn this language before you can understand the books. Unfortunately, it seems that this language isn't described anywhere in this library...",
        stages: [
            'Learn the ancient language.',
            "Perfom the 'Decode' action to decode the books.",
        ],
        unlocks: questIds.ARTEFACTS_3,
        stageOrder: 'inOrder',
    },
    {
        id: questIds.ARTEFACTS_3,
        name: 'Artefacts, Part 3',
        when: 'You received this quest by completing Artefacts, Part 2.',
        description:
            "Finally, you have received a lead. Apparently, legends say that the Pearl of Asclepius was hidden underneath the Statue of Triton. You will need to gain access to the Statue of Triton, and then obtain an Ancient Staff to be able to wield the Pearl of Asclepius. You can get a tourist's pass to gain deeper access to the Statue of Triton, but you're not very sure of where to find the Staff...",
        stages: [
            'Get a UnderseaDiscovers Ticket.',
            'Search for an Ancient Staff.',
        ],
        unlocks: questIds.ARTEFACTS_4,
        stageOrder: 'anyOrder',
    },
    {
        id: questIds.ARGUMENT,
        name: 'An Argument',
        when: "You received this quest by performing the action 'Explore' at Salmon Street.",
        description:
            'You notice two children chasing each other with a long and pointy staff. How dangerous!',
        stages: ["Perform the 'Confront Children' action at Salmon Street."],
        reward: ['Ancient Staff'],
        stageOrder: 'anyOrder',
    },
    {
        id: questIds.ARTEFACTS_4,
        name: 'Artefacts, Part 4',
        when: 'You received this quest by completing Artefacts, Part 3.',
        description:
            'You have obtained the necessary items and you are now able to retrieve the Pearl of Asclepius. Good luck!',
        stages: [
            "Perform the 'Explore' action at the Statue of Triton.",
        ],
        reward: ['Access to the Hidden Alcove'],
        stageOrder: 'inOrder',
    },
    {
        id: questIds.SHRINE_1,
        name: 'Shrine of the Innocent, Part 1',
        when: "You received this quest by performing the action 'Explore' at Kelp Plains.",
        description:
            'Wandering around Kelp Plains, you discover a small shrine tucked in a valley. The journey to the shrine looks rather arduous.',
        stages: [
            "Perform the 'Climb down valley' action to get to the Shrine of the Innocent.",
        ],
        stageOrder: 'anyOrder',
        unlocks: questIds.SHRINE_2,
    },
    {
        id: questIds.SHRINE_2,
        name: 'Shrine of the Innocent, Part 2',
        when: 'You received this quest by completing Shrine of the Innocent, Part 1',
        description: [
            'The shrinekeeper seems surprised at your arrival. He says that it is very rare for the shrine to have visitors.',
            "After you tell him about the purpose of your journey, the shrinekeeper tells you that you can perform a ritual to receive a Unicorn Tear.",
            "First, you will have to return to the surface to obtain a Unicorn's Hair. After getting the Unicorn's Hair, you will enter Challenge Mode. You must then return to the undersea, give the Unicorn's Hair to the Shrine, and then survive for 30 minutes in Challenge Mode.",
            'When in Challenge Mode, you will only get less Oxygen from diving and Oxygen Streams. Oxygen Pumps will also not work. Check your Notes for more information about Challenge Mode.'
        ].join('\n\n'),
        stages: [
            "Perform the 'Resurface' action at the Shallows to travel to Sleepy Shores. WARNING: You will lose all your Oxygen when you do this action.",
            "Get a Unicorn's Hair at the Whispering Woods.",
            "Return to the Undersea. WARNING: Diving with a Unicorn's Hair in your inventory will put you in Challenge Mode.",
            "Perform the 'Give Unicorn's Hair' action at the Shrine of the Innocent.",
            'Survive for 30 minutes in Challenge Mode without resurfacing.',
            "Perform the 'Collect Unicorn Tear' action at the Shrine of the Innocent.",
        ],
        stageOrder: 'inOrder',
        reward: ['Unicorn Tear'],
    },
    {
        id: questIds.CLOAK_1,
        name: 'The Man in the Cloak, Part 1',
        when: "You received this quest by performing the action 'Explore' at the Umbral Ruins.",
        description: [
            '‘Greetings. My name is Alyusi Islassis. Is it your first time here in the Undersea?’',
            '‘I am a dealer in exotic goods. I heard you are looking for a Pearl of Asclepius, yes? I do have one, but if you want me to let go of it, it had better be worth my while...’',
            '‘What do I want? Well, I am interested in procuring thousand year old blinkseed sap. I will also need a container for the sap. A good one would be a pan made of pyrite. An old lady who lives at Barnacle Residences has one.’',
        ].join('\n\n'),
        stages: [
            'Get a Pyrite Pan at Barnacle Residences.',
            "Perform the 'Show Pyrite Pan' action at the Umbral Ruins.",
        ],
        stageOrder: 'inOrder',
        unlocks: questIds.CLOAK_2,
    },
    {
        id: questIds.PYRITE,
        name: 'Pyrite Lady',
        when: "You received this quest by performing the action 'Explore' at the Barnacle Residences.",
        description: [
            '‘Oh hello there, dearie. Talk to an old lady, would you?’',
            '‘They call me the Pyrite Lady. Why’s that? Well, all my potionware are made of pyrite. The ignorant call pyrite ‘fool’s gold’, but it has very special magical properties, which I need for the potions I make.’',
            '‘I am getting old, and I accidentally mixed some of my potion ingredients together. Help an old lady, and you will get one of her extra pans.’',
        ].join('\n\n'),
        stages: [
            "Perform the 'Help Pyrite Lady' action at Barnacle Residences.",
        ],
        stageOrder: 'anyOrder',
    },
    {
        id: questIds.CLOAK_2,
        name: 'The Man in the Cloak, Part 2',
        when: 'You received this quest by completing The Man in the Cloak, Part 1.',
        description: [
            '‘Ah, very good, the pyrite pan is exactly what you need.’',
            '‘Now, I will need your assistance with one more thing. The bark of a blinkseed is very thick, and you will need a knife fashioned with a rare kind of mineral, chmyrrkyth. It looks like a black rock, but it has special properties that would allow you to cut the blinkseed bark. You can buy it at the General Store.’',
            '‘Reimbursement? Get me the chmyrrkyth first, then we’ll talk.’',
        ].join('\n\n'),
        stages: [
            'Find something that fits the description of the Chmyrrkyth.',
            "Perform the 'Give Chmyrrkyth' action at the Umbral Ruins",
        ],
        stageOrder: 'inOrder',
        unlocks: questIds.CLOAK_3,
    },
    {
        id: questIds.CLOAK_3,
        name: 'The Man in the Cloak, Part 3',
        when: 'You received this quest by completing The Man in the Cloak, Part 2.',
        description: [
            '‘Very good. Now, while I make the knife, you can go harvest some blinkseed.’',
            '‘Where to find blinkseed? It grows on Kelp Plains. The seaweed? Yes, I suppose you landdwellers might think that it looks like seaweed. Don’t be fooled. While it may look exactly like seaweed, it isn’t. Give me a few blades of blinkseed.’',
            '‘Money for the chmyrrkyth? My dear, once I have the blinkseed sap, I will give it to you with the pearl.’',
        ].join('\n\n'),
        stages: [
            "Perform the 'Harvest' action at Kelp Plains.",
            'Get 3 x Blinkseed.',
            'Travel back to the Umbral Plains.',
        ],
        stageOrder: 'inOrder',
    },
];

export const quests: Record<QuestId, Quest> = {};
questList.forEach((quest) => {
    quests[quest.id] = quest;
});
