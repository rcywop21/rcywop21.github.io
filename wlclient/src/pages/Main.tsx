import React from 'react';
import Login from '../components/Login';
import Game from '../components/Game';

export interface MainProps {
    loggedIn: boolean;
    updateLoggedIn: (x: boolean) => void;
}

const Main = (props: MainProps): React.ReactElement => {
    const { loggedIn, updateLoggedIn } = props;

    if (!loggedIn) {
        return (
            <div>
                <Login updateLoggedIn={updateLoggedIn} mode="player" />
            </div>
        );
    }

    return (
        <div>
            <Game groupId="420"/>
        </div>
    );
};

export default Main;
