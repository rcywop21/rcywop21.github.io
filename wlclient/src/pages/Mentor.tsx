import React from 'react';
import io, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { ENDPOINT } from '../socket/socket';

export interface MentorProps {
    chapter?: number;
    setChapter: (x?: number) => void;
    deadline: Date | null;
    setDeadline: (x: Date | null) => void;
}

const Mentor = (props: MentorProps): React.ReactElement => {
    const { deadline, setDeadline } = props;

    const [socket, setSocket] = React.useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [readyToLogin, setReadyToLogin] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (readyToLogin) {
            console.log('ready to login!');
            const socket = io(ENDPOINT);
            console.log(socket);
            setSocket(socket);

            socket.on('connect', () => {
                console.log('Hello!');
            })

            setReadyToLogin(false);

            return () => {
                setSocket(null);
                socket.disconnect();
            }
        }
    }, [readyToLogin, setReadyToLogin, setSocket]);

    console.log(socket);

    const onLogin = () => {
        setReadyToLogin(true);
    };

    if (socket) {
        return (
            <main>
                <div>Logged in!</div>
            </main>
        );
    }

    return (
        <main>
            <div><button onClick={onLogin}>Login</button></div>
        </main>
    )

}

export default Mentor;
