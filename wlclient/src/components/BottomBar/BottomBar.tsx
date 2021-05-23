import React from 'react';
import Notifications from './Notifications';
import QuestLog from './QuestLog';
import { Message, QuestId, QuestState } from 'wlcommon';
import './BottomBar.css';

export interface BottomBarProps {
    notifications: Message[];
    quests: Record<QuestId, QuestState>;
}

const BottomBar = (props: BottomBarProps): React.ReactElement => {
    const { notifications, quests } = props;

    return (
        <div className="bottomBar">
            <Notifications key = {notifications.length} notifications={notifications} />
            <QuestLog quests={quests} />
        </div>
    );
};

export default BottomBar;
