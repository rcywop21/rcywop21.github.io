import React from 'react';
import { useState } from 'react';
import { SocketContext } from '../socket/socket';
import './Login.css';

export interface LoginProps {
    updateLoggedIn: (x: boolean) => void;
}

const Login = (props: LoginProps): React.ReactElement => {
    const { updateLoggedIn } = props;
    const [ groupName, setGroupName ] =  useState("");
    const [ password, setPassword ] =  useState("");

    const socket = React.useContext(SocketContext);

    React.useEffect(() => { 
        if (socket != null) {
            socket.emit('auth', { id: +groupName, type: 'mentor', pass: password })
        }
    })

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
        <div className="login">
            <div className="block">Group Name</div>
            <input className="block" value={ groupName } onChange={(e) => setGroupName(e.target.value)}></input>
            <div className="block">Password</div>
            <input className="block" value={ password } onChange={(e) => setPassword(e.target.value)}></input>
            <div><button onClick={handleLogin}>Login</button></div>
        </div>
    );
};

export default Login;
