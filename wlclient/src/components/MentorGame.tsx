import React from 'react';
import Game from './Game';
import { GameProps } from './Game';

const MentorGame = (props: GameProps): React.ReactElement => {
    
    return (
        <div>
            <div style={{height: "70px"}}></div>
            <span style={{border: "2px solid green"}}>Mentor Powers!</span>
            <Game {...props} isMentor={true} />
        </div>
    );
}

export default MentorGame;