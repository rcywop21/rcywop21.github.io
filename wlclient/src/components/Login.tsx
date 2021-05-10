import React from 'react';
import { SocketContext } from '../socket/socket';

export interface LoginProps {
    updateLoggedIn: (x: boolean) => void;
}

const Login = (props: LoginProps): React.ReactElement => {
    const { updateLoggedIn } = props;

    const socket = React.useContext(SocketContext);

    const handleLogin = () => {
        if (socket !== null) {
            socket.connect();
            socket.on('connect', () => {
                updateLoggedIn(true);
            });

            socket.on('disconnect', () => {
                updateLoggedIn(false);
            });
        }
    };

    // Needs team name and password fields

    return (
        <div>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
