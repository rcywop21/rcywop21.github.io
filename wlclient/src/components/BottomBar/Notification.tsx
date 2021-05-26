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
    
    const [isRecent, setIsRecent] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (determineIfRecent(time)) {
            setIsRecent(true);
            const timeout = setTimeout(() => setIsRecent(false), recentNotifTiming - (Date.now() - time.valueOf()));
            return () => clearTimeout(timeout);
        }
    }, [time]);

    const isQuestNotif = /quest/ig.test(message);
    
    return (
        <p className={`notif ${isQuestNotif ? "questNotif" : isRecent ? "recentNotif" : "oldNotif"}`}>
            {message}
        </p>
    );
}

export default Notification;
    
