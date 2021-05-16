import React from 'react';
import Login from '../components/Login';

export interface MainProps {
    loggedIn: boolean;
    updateLoggedIn: (x: boolean) => void;
}

const Main = (props: MainProps): React.ReactElement => {
    const { loggedIn, updateLoggedIn } = props;

    if (!loggedIn) {
        return (
            <div>
                <Login updateLoggedIn={updateLoggedIn} mode="player"/>
            </div>
        );
    }

    return <div>Logged in! WIP</div>;
};

export default Main;
