import React from 'react';
import Login from '../components/Login';

export interface MentorProps {
    loggedIn: boolean;
    updateLoggedIn: (x: boolean) => void;
}

const Mentor = (props: MentorProps): React.ReactElement => {
    const { loggedIn, updateLoggedIn } = props;

    if (!loggedIn) {
        return (
            <div>
                <Login updateLoggedIn={updateLoggedIn} mode="admin" />
            </div>
        );
    }

    return <div>Logged in! WIP</div>;
};

export default Mentor;
