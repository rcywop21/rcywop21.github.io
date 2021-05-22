import React from 'react';
import Notifications from './Notifications';
import QuestLog from './QuestLog';
import { Message } from 'wlcommon';
import './BottomBar.css';

export interface BottomBarProps {
    notifications: Message[];
    quests: any;
}

const BottomBar = (props: BottomBarProps): React.ReactElement => {
    const { notifications, quests } = props;
    
    return (
        <div className="bottomBar">
            <Notifications notifications={notifications} />
            <QuestLog quests={quests} />
        </div>
    );
}

export default BottomBar;