import React from 'react';
import { SocketContext } from '../socket/socket';
import './Login.css';

export interface LoginProps {
    updateLoggedIn: (x: boolean) => void;
    mode: string;
}

const Login = (props: LoginProps): React.ReactElement => {
    const { updateLoggedIn, mode } = props;
    const [groupName, setGroupName] = React.useState<number | undefined>(undefined);
    const [password, setPassword] = React.useState('');

    const socket = React.useContext(SocketContext);

    React.useEffect(() => { 
        if (socket != null && groupName != undefined) {
            socket.emit('auth', { id: +groupName, type: mode, pass: password })
        }
    })

    const handleLogin = () => {
        if (groupName === undefined) return; // handle empty group name error

        if (socket !== null) {
            socket.connect();
            socket.on('connect', () => {
                socket.emit(
                    'authenticate', 
                    { id: groupName, mode: mode, pass: password }, 
                    (eventType: string, payload: string | Record<string, unknown>) => {
                        if (eventType === 'auth_ok') {
                            updateLoggedIn(true);
                            socket.on('disconnect', () => updateLoggedIn(false));
                            // TODO: update local copy of game state (wait for game state to be polished first)
                        } else if (eventType === 'error') {
                            // TODO: handle error
                            // TODO: error details are inside payload
                        }
                    }
                );
            });
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
    }

    return (
        <div className="login">
            <div className="block">Group Name</div>
            <input
                className="block"
                value={groupName === undefined ? '' : groupName.toString()}
                onChange={onGroupNameChange}
            ></input>
            <div className="block">Passcode</div>
            <input
                className="block"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            ></input>
            <div>
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default Login;
