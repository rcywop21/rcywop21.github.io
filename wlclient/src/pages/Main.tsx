import React from 'react';
import Login from '../components/Login';
import Game from '../components/Game';
import { GlobalState, PlayerState } from 'wlcommon';
import { SocketContext } from '../socket/socket';

const Main = (): React.ReactElement => {
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
        socket?.on('player_update', (newGameState: PlayerState) => {
            setPlayerState(newGameState);
        });
        socket?.on('global_update', (newGameState: GlobalState) => {
            setGlobalState(newGameState);
        });
    }, [socket]);

    if (playerState && globalState && teamId !== undefined) {
        return (
            <div>
                <Game globalState={globalState} playerState={playerState} teamId={teamId}/>
            </div>
        );
    }

    return (
        <div>
            <Login
                mode="player"
                updateLoggedIn={() => undefined}
                updateGlobalState={setGlobalState}
                updatePlayerState={setPlayerState}
                updateTeamId={setTeamId}
            />
        </div>
    );
};

export default Main;
