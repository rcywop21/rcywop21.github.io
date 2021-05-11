export type QuestId = number;
export type QuestStatus = 'completed' | 'incomplete' | 'hidden';

export interface Quest {
    id: QuestId;
    name: string;
    description: string;
    unlocks: QuestId | null;
    reward: ItemRecord | null;
    stages: string[];
    stageOrder: 'inOrder' | 'anyOrder';
}

export interface QuestState {
    id: QuestId;
    status: QuestStatus;
    stages: boolean[];
}
