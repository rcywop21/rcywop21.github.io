import React from 'react';
import { PlayerState, GlobalState } from 'wlcommon';
import './Journal.css';

export interface ChallengeModeInfoProps {
    playerState: PlayerState;
    globalState: GlobalState;
}

const ChallengeModeInfo = (props: ChallengeModeInfoProps): React.ReactElement => {
    const { playerState } = props;
    
    return (
        <div>
            <h2 className="journalTitle">CHALLENGE MODE INFO</h2>
            <p>{`This doesn't do anything (yet).`}</p>
        </div>
    );
}

export default ChallengeModeInfo;