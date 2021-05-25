import React from 'react';
import './Journal.css';

const JournalMenu = (): React.ReactElement => {
    
    return (
        <div>
            <button>Quest Journal</button>
            <span>&emsp;</span>
            <button>Notes</button>
            <span>&emsp;</span>
            <button>Oxygen</button>
        </div>
    );
}

export default JournalMenu;