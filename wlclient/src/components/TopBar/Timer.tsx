import React from 'react';
import './Timer.css';

export interface TimerProps {
    name: string;
    time: string;
}

const TIMER_IMG_ASSET_MAP: Map<string, string> = new Map([
    ["oxygen", "oxygen.png"],
    ["crimson", "crimson.png"]
]);

function getImg(name: string): string {
    const imgFileName = TIMER_IMG_ASSET_MAP.get(name);
    
    if (!imgFileName) {
        return "";
    }
    
    const imgFileDirectory = "/assets/timers/";
    
    return imgFileDirectory + imgFileName;
}

const Timer = (props: TimerProps): React.ReactElement => {
    const { name, time } = props;
    const [timeLeft, setTimeLeft] = React.useState<number>(Date.parse(time) - Date.now())
    
    //timer processing
    const minLeft = Math.max(Math.floor(timeLeft/60000), 0)
    const secLeft = Math.max(Math.floor(timeLeft/1000) % 60, 0)
    
    React.useEffect(() => {
        const timer = setInterval(() => setTimeLeft(Date.parse(time) - Date.now()), 500);
        return () => clearInterval(timer);
    });
    
    return (
        <div className="timer">
            <img src={getImg(name)} />
            <span>{minLeft.toString()}:{secLeft.toString().padStart(2, "0")}</span>
        </div>
    );
}

export default Timer;