import React from 'react';
import Login from '../components/Login';
import { SocketContext } from '../socket/socket';
import './Admin.css';

export interface AdminProps {
    loggedIn: boolean;
    updateLoggedIn: (x: boolean) => void;
}

interface OutputEntry {
    time: Date;
    type: string;
    message: string;
    input: string;
}

interface ClearAction {
    type: 'clear';
}

interface NewEntryAction {
    type: 'new_entry';
    payload: OutputEntry;
}

type AdminCommandAction = ClearAction | NewEntryAction;

const adminCommandReducer = (
    state: OutputEntry[],
    action: AdminCommandAction
): OutputEntry[] => {
    switch (action.type) {
        case 'clear':
            return [];
        case 'new_entry':
            return [...state, action.payload];
    }
};

const Admin = (props: AdminProps): React.ReactElement => {
    const { loggedIn, updateLoggedIn } = props;
    const [input, setInput] = React.useState('');
    const [output, outputDispatch] = React.useReducer(adminCommandReducer, []);
    const socket = React.useContext(SocketContext);

    if (!loggedIn) {
        return (
            <div>
                <Login updateLoggedIn={updateLoggedIn} mode="admin" />
            </div>
        );
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        setInput(event.target.value);
    };

    const handleKeydown: React.KeyboardEventHandler<HTMLInputElement> = (
        event
    ) => {
        if (event.key !== 'Enter') return;
        if (input === 'clear') {
            outputDispatch({ type: 'clear' });
        } else {
            if (input.slice(0, 8) === 'announce') {
                socket?.emit(
                    'announce',
                    input.slice(9),
                    (event: string, payload: unknown) => {
                        const message =
                            typeof payload === 'string'
                                ? payload
                                : JSON.stringify(payload);
                        outputDispatch({
                            type: 'new_entry',
                            payload: {
                                time: new Date(),
                                message,
                                type: event,
                                input,
                            },
                        });
                    }
                )
            } else {
                socket?.emit(
                    'admin',
                    input.split(' '),
                    (event: string, payload: unknown) => {
                        const message =
                            typeof payload === 'string'
                                ? payload
                                : JSON.stringify(payload);
                        outputDispatch({
                            type: 'new_entry',
                            payload: {
                                time: new Date(),
                                message,
                                type: event,
                                input,
                            },
                        });
                    }
                );
            }
        }
        setInput('');
    };

    return (
        <div className="admin">
            <div className="output">
                {output.map((entry, i) => (
                    <React.Fragment key={i}>
                        <p className="input">
                            [{entry.time.toLocaleTimeString('en-UK')}]{' '}
                            {entry.input}
                        </p>
                        <p className={entry.type}>{entry.message}</p>
                    </React.Fragment>
                ))}
            </div>
            <input
                placeholder="Command"
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeydown}
            />
        </div>
    );
};

export default Admin;
