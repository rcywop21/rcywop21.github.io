import React from 'react';
import { SocketContext } from '../socket/socket';
import './Login.css';

export interface LoginProps {
    updateLoggedIn: (x: boolean) => void;
    mode: string;
}

const Login = (props: LoginProps): React.ReactElement => {
    const { updateLoggedIn, mode } = props;
    const [groupName, setGroupName] = React.useState<number | undefined>(
        undefined
    );
    const [password, setPassword] = React.useState('');
    const [hasErrorMessage, setHasErrorMessage] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const socket = React.useContext(SocketContext);

    React.useEffect(() => {
        if (socket !== null && !socket.connected) {
            socket.connect();
        }
    }, [socket, updateLoggedIn]);

    const handleLogin = () => {
        if (groupName === undefined && password === '') {
            setHasErrorMessage(true);
            setErrorMessage('Group Name and Password cannot be empty');
            return;
        } else if (groupName === undefined) {
            setHasErrorMessage(true);
            setErrorMessage('Group Name cannot be empty');
            return;
        } else if (password == '') {
            setHasErrorMessage(true);
            setErrorMessage('Password cannot be empty');
            return;
        }

        if (socket !== null) {
            socket.emit(
                'authenticate',
                { id: groupName, mode: mode, pass: password },
                (
                    eventType: string,
                    payload: string | Record<string, unknown>
                ) => {
                    if (eventType === 'auth_ok') {
                        updateLoggedIn(true);
                        // TODO: update local copy of game state (wait for game state to be polished first)
                    } else if (eventType === 'error') {
                        setHasErrorMessage(true);
                        if (typeof payload === 'string') {
                            setErrorMessage(payload);
                        }
                    } else {
                        // TODO: unexpected error happened, to handdle
                    }
                }
            );
        }
    };

    const onGroupNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') {
            setGroupName(undefined);
            return;
        }
        const groupId = parseInt(event.target.value);
        if (Number.isNaN(groupId) || groupId < 0) return;
        setGroupName(groupId);
    };

    return (
        <div className="login">
            <div className="title">Group Name</div>
            <input
                value={groupName === undefined ? '' : groupName.toString()}
                onChange={onGroupNameChange}
            ></input>
            <div className="title">Passcode</div>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            ></input>
            <div>
                <button onClick={handleLogin}>Login</button>
            </div>
            <div>
                {hasErrorMessage && (
                    <div className="errorMessage">{errorMessage}</div>
                )}
                {!hasErrorMessage && (
                    <div>
                        <br></br>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
