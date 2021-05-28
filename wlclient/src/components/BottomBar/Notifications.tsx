import React from 'react';
import Notification from './Notification';
import { Message } from 'wlcommon';
import './Notifications.css';

export interface NotificationsProps {
    notifications: Message[];
}

export function notifToDisplayString(message: Message): string {
    return `[${new Date(message.time).toTimeString().slice(0, 5)}]  ${
        message.message
    }`;
}

const Notifications = (props: NotificationsProps): React.ReactElement => {
    const { notifications } = props;
    notifications.sort((n1, n2) => (n1.time < n2.time ? 1 : -1));

    React.useEffect(() => {
        new Audio('/assets/notif-sound/new-notif.ogg').play();
    }, [notifications.length]);

    return (
        <div className="notifications">
            <h2 className="notifTitle">NOTIFICATIONS</h2>
            <div className="innerNotifBox">
                {notifications.map((message: Message, index: number) => {
                    return (
                        <Notification
                            key={index}
                            time={new Date(message.time)}
                            message={notifToDisplayString(message)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Notifications;
