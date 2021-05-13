import React from 'react';
import io from 'socket.io-client';

export const ENDPOINT =
    process.env.REACT_APP_BACKEND || 'http://localhost:8000';

export const socket = io(ENDPOINT, { autoConnect: false });
export const SocketContext = React.createContext<typeof socket | null>(null);
