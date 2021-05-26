import React from 'react';
import { PlayerState, GlobalState } from 'wlcommon';
import './Journal.css';

export interface AnnouncementsProps {
    globalState: GlobalState;
}

const Announcements = (props: AnnouncementsProps): React.ReactElement => {
    const { globalState } = props;
    
    return (
        <div>
            <h2 className="journalTitle">ANNOUNCEMENTS</h2>
            <p>{`This doesn't do anything (yet) (as well).`}</p>
        </div>
    );
}

export default Announcements;