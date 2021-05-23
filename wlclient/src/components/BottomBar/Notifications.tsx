import React from 'react';
import { Message } from 'wlcommon';
import './Notifications.css';

export interface NotificationsProps {
    notifications: Message[];
}

const Notifications = (props: NotificationsProps): React.ReactElement => {
    const { notifications } = props;
    notifications.sort((n1, n2) => n1.time < n2.time ? 1 : -1)
    
    function notifToDisplayString(message: Message): string {
        return `[${(new Date(message.time)).toTimeString().slice(0, 5)}]  ${message.message}`;
    }
    
    return (
        <div className="notifications">
            <h2 className="notifTitle">NOTIFICATIONS {notifications.length}</h2>
            <div className="innerNotifBox">
                {notifications.map((message: Message) => {
                    return (<p 
                        className="notif" 
                        key={message.time.toString()}>
                        {notifToDisplayString(message)}
                    </p>);
                })}
            </div>
        </div>
    );
};

export default Notifications;
