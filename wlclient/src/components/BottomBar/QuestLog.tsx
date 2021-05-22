import React from 'react';
import QuestInfo from './QuestInfo';
import './QuestLog.css';

export interface QuestLogProps {
    quests: any;
}

const QuestLog = (props: QuestLogProps): React.ReactElement => {
    const { quests } = props;
    
    const questArray: string[][] = [
        ["Nigerian Prince Part II", "Obtain bits of grass x10"],
        ["Mr Crabs is Hungry!", "Return to Mr Crabs by 19:40"],
        ["testQuest", "testtext that is really really long asndkjsiebfhlfdlabhfbhasb c sadbsahdb sahbds bskjs dnksjanas snlsk nsjadn lsjaknjsdn kdnasl dnsadnas ndns alnjnasjknaslkjdnsalk dskjla"]
    ];
    
    return (
        <div className="questLog">
            <h2 className="questTitle">QUESTS</h2>
            <div className="innerQuestBox">
                {questArray.map((item: string[]) => (<QuestInfo key="" questData={item} />))}
            </div>
        </div>
    );
}

export default QuestLog;