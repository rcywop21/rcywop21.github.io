import React from 'react';
import { Util } from 'wlcommon';
import './Timer.css';

export interface TimerProps {
    name: string;
    until: Date;
}

const TIMER_IMG_ASSET_MAP: Map<string, string> = new Map([
    ['oxygen', 'oxygen.png'],
    ['crimson', 'crimson.png'],
]);

const UPDATE_INTERVAL = 1000 / 10;

function getImg(name: string): string {
    const imgFileName = TIMER_IMG_ASSET_MAP.get(name);

    if (!imgFileName) {
        return '';
    }

    const imgFileDirectory = '/assets/timers/';

    return imgFileDirectory + imgFileName;
}

const Timer = (props: TimerProps): React.ReactElement => {
    const { name, until } = props;
    const [timeLeft, setTimeLeft] = React.useState(
        new Date(until).valueOf() - Date.now()
    );

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(new Date(until).valueOf() - Date.now());
        }, UPDATE_INTERVAL);
        return () => clearInterval(timer);
    }, [setTimeLeft, until]);

    return (
        <div className="timer">
            <img src={getImg(name)} />
            <span>{Util.formatDuration(timeLeft)}</span>
        </div>
    );
};

export default Timer;
