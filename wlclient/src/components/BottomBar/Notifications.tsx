import React from 'react';
import './Notifications.css';

export interface NotificationsProps {
    notifications: string[];
}

const Notifications = (props: NotificationsProps): React.ReactElement => {
    const { notifications } = props;
    notifications.sort().reverse();
    
    return (
        <div className="notifications">
            <h2 className="notifTitle">NOTIFICATIONS</h2>
            <div className="innerNotifBox">
                {notifications.map((item: string) => (<p className="notif" key={notifications.indexOf(item)}>{item}</p>))}
            </div>
        </div>
    );
}

export default Notifications;