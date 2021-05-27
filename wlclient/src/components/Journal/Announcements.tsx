import React from 'react';
import { notifToDisplayString } from '../BottomBar/Notifications';
import { GlobalState, Message } from 'wlcommon';
import './Journal.css';

export interface AnnouncementsProps {
    globalState: GlobalState;
}

const Announcements = (props: AnnouncementsProps): React.ReactElement => {
    const { globalState } = props;

    const announcements: Message[] = globalState.messages.filter(
        (message) => message.visibility === 'all'
    );
    announcements.forEach(
        (message) =>
            (message.message = message.message.replace('[Announcement]', ''))
    );
    announcements.sort((m1, m2) => (m1.time < m2.time ? 1 : -1));
    console.log(JSON.stringify(announcements));

    return (
        <div>
            <h2 className="journalTitle">ANNOUNCEMENTS</h2>
            <p className="helptext">
                This page contains the list of all announcements - mainly great
                achievements by all groups.
            </p>
            {announcements.map((message, index) => (
                <p key={index}>{notifToDisplayString(message)}</p>
            ))}
        </div>
    );
};

export default Announcements;
