import React from 'react';

export interface NotesProps {
    playerState: any
}

const Notes = (props: NotesProps): React.ReactElement => {
    const { playerState } = props;
    
    return (
        <div>
            <h2>NOTES</h2>
            <p>bleh</p>
        </div>
    );
}

export default Notes;