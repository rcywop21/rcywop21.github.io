import React from 'react';
import Login from '../components/Login';
import Game from '../components/Game';
import { GlobalState, PlayerState } from 'wlcommon';
import { SocketContext } from '../socket/socket';

export interface MainProps {
    loggedIn: boolean;
    updateLoggedIn: (x: boolean) => void;
}

const Main = (props: MainProps): React.ReactElement => {
    const { loggedIn, updateLoggedIn } = props;

    const [playerState, setPlayerState] = React.useState<
        PlayerState | undefined
    >(undefined);
    const [globalState, setGlobalState] = React.useState<
        GlobalState | undefined
    >(undefined);
    const [teamId, setTeamId] = React.useState<
        number | undefined
    >(undefined);

    const socket = React.useContext(SocketContext);

    React.useEffect(() => {
        console.log(socket);
        socket?.on('player_update', (newGameState: PlayerState) => {
            setPlayerState(newGameState);
        });
        socket?.on('global_update', (newGameState: GlobalState) => {
            setGlobalState(newGameState);
        });
    }, [socket]);

    if (playerState && globalState && teamId) {
        return (
            <div>
                <Game globalState={globalState} playerState={playerState} teamId={teamId}/>
            </div>
        );
    }

    return (
        <div>
            <Login
                mode="mentor"
                updateLoggedIn={updateLoggedIn}
                updateGlobalState={setGlobalState}
                updatePlayerState={setPlayerState}
                updateTeamId={setTeamId}
            />
        </div>
    );
};

export default Main;
