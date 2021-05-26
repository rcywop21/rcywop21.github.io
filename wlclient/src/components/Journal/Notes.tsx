import React from 'react';

export interface NotesProps {
    playerState: any
}

const Notes = (props: NotesProps): React.ReactElement => {
    const { playerState } = props;
    
    return (
        <div>
            <h2 className="journalTitle">NOTES</h2>
            <p>{`This doesn't do anything (yet).`}</p>
        </div>
    );
}

export default Notes;