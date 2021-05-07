import React from 'react';
import './Header.css';

export interface HeaderProps {
    chapter?: number;
    deadline?: Date;
}

const UPDATE_INTERVAL = 1000 / 25;

const padTo2Digit = (x: number) => x.toString().padStart(2, '0');

const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return seconds + 's';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${padTo2Digit(seconds % 60)}s`;

    const hours = Math.floor(minutes / 60);
    return `${hours}h ${padTo2Digit(minutes % 60)}m ${padTo2Digit(
        seconds % 60
    )}s`;
};

const Header = (props: HeaderProps): React.ReactElement => {
    const { chapter, deadline } = props;

    const [timeLeft, setTimeLeft] = React.useState<number | null>(null);

    React.useEffect(() => {
        const timer = setInterval(() => {
            if (deadline == null) {
                setTimeLeft(null);
            } else {
                setTimeLeft(deadline - new Date());
            }
        }, UPDATE_INTERVAL);
        return () => clearInterval(timer);
    }, [setTimeLeft, deadline]);

    return (
        <header className="App-header">
            <div className="title">
                Ex Wanderlust
                {chapter && (
                    <span className="chapter-num"> (Chapter {chapter})</span>
                )}
            </div>
            <div className="info">
                {timeLeft != null && timeLeft > 0 && (
                    <div className="info-item">
                        <div className="info-title">Time Left</div>
                        <div className="info-num">{formatTime(timeLeft)}</div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
