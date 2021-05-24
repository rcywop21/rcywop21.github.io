import React from 'react';
import './Notifications.css';

export interface NotificationProps {
    time: Date;
    message: string;
}

function determineIfDateClose(d1: Date, d2: Date): boolean {
    return (d1.valueOf() - d2.valueOf()) < 5000;
}

function determineIfRecent(d: Date): boolean {
    return determineIfDateClose(new Date(), d);
}

const Notification = (props: NotificationProps): React.ReactElement => {
    const { time, message } = props;
    
    const [isRecent, setIsRecent] = React.useState<boolean>(determineIfRecent(time));
    
    if (determineIfRecent(time)) {
        setInterval(() => setIsRecent(false), 5000);
    }
    
    return (
        <p className={`notif ${isRecent ? "recentNotif" : "oldNotif"}`}>
            {message}
        </p>
    );
}

export default Notification;
    