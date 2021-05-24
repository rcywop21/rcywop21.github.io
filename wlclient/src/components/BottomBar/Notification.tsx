import React from 'react';
import './Notifications.css';

export interface NotificationProps {
    time: Date;
    message: string;
}

const recentNotifTiming = 5000;

function determineIfDateClose(d1: Date, d2: Date): boolean {
    return (d1.valueOf() - d2.valueOf()) < recentNotifTiming;
}

function determineIfRecent(d: Date): boolean {
    return determineIfDateClose(new Date(), d);
}

const Notification = (props: NotificationProps): React.ReactElement => {
    const { time, message } = props;
    
    const [isRecent, setIsRecent] = React.useState<boolean>(determineIfRecent(time));
    
    if (determineIfRecent(time)) {
        setInterval(() => setIsRecent(false),
            recentNotifTiming - (Date.now() - time.valueOf()));
    }
    
    return (
        <p className={`notif ${isRecent ? "recentNotif" : "oldNotif"}`}>
            {message}
        </p>
    );
}

export default Notification;
    