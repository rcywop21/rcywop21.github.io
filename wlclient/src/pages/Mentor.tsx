import React from 'react';
import Login from '../components/Login';
import MentorGame from '../components/MentorGame';
import { GlobalState, PlayerState } from 'wlcommon';
import { SocketContext } from '../socket/socket';
import { LoginMode } from '../App';

export interface MentorProps {
    updateLoggedIn: (x: LoginMode | undefined) => void;
}

const Mentor = (props: MentorProps): React.ReactElement => {
    const { updateLoggedIn } = props;

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

    if (playerState && globalState && teamId) {
        return (
            <div>
                <MentorGame globalState={globalState} playerState={playerState} teamId={teamId}/>
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

export default Mentor;
