import React from 'react';
import './Timer.css';

export interface TimerProps {
    name: string;
    time: string;
}

const Timer = (props: TimerProps): React.ReactElement => {
    const { name, time } = props;
    const [timeLeft, setTimeLeft] = React.useState<number>(Date.parse(time) - Date.now());
    
    //timer processing
    
    return (
        <div className="timer">
            <h3>{name.charAt(0).toUpperCase()}</h3>
            <span>{timeLeft}</span>
        </div>
    );
}

export default Timer;