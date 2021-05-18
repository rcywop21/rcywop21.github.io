export type QuestId = number;
export type QuestStatus = 'completed' | 'incomplete' | 'hidden';

export interface Quest {
    id: QuestId;
    name: string;
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

const questList: Quest[] = [
    {
        id: 10,
        name: 'Chapter 1: The Seas',
        description: 'The King has tasked several adventuring groups with retrieving two lost artefacts from the Undersea. As a newcomer to the Undersea, you will need to learn how to dive, survive in the Undersea and find your way around.',
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
        id: 20,
        name: 'Chapter 2: The Search',
        description: 'Now that you are familiar with how to dive and survive in the Undersea, it is time for you to properly begin your journey. Explore around to find the two legendary artefacts.',
        stages: [
            "Search for a Unicorn's Tear.",
            'Search for a Pearl of Asclepius.',
        ],
        stageOrder: 'anyOrder',
    },
    {
        id: 40,
        name: 'Chapter 3: The Scent',
        description: 'The waters around you start to turn a faint shade of red... It seems that something is awakening...',
        stages: [
            "As a programme, ensure that the Crimson doesn't awaken until every team has completed Chapter 2.",
        ],
        stageOrder: 'anyOrder',
    },
    {
        id: 21,
        name: 'The Finches Code',
        description: 'The Memorial Corals houses many exhibits, detailing the history of the Undersea civilization. One such exhibit describes a language used by the Undersea a few centuries ago. You have a hunch that knowing this language could help you on your quest.',
        stages: [
            "Perform the 'Learn Language' action to learn the language.",
            'Search for an object written in the ancient language.',
            "Perform the 'Decode' action on that object to decode it.",
        ],
        stageOrder: 'inOrder',
    }
];

const quests: Record<number, Quest> = {};
questList.forEach((quest) => {
    quests[quest.id] = quest;
})

export default quests;

