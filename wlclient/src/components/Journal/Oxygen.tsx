import React from 'react';

export interface OxygenProps {
    playerState: any
}

const Oxygen = (props: OxygenProps): React.ReactElement => {
    const { playerState } = props;
    
    return (
        <div>
            <h2>OXYGEN INFO</h2>
            <p>bleh</p>
        </div>
    );
}

export default Oxygen;