import React from 'react';
import './App.css';
import Header from './components/Header';
import io from 'socket.io-client';

const ENDPOINT = process.env.REACT_APP_ENDPOINT || 'http://localhost:8000';

function App(): React.ReactElement {

    React.useEffect(() => {
        const socket = io(ENDPOINT);
        console.log('socket');
        return () => {
            socket.disconnect();
        }
    }, []);

    return (
        <div className="App">
            <Header chapter={1} deadline={new Date('2021-05-08T01:59:59')} />
            <div className="App-container">Test2</div>
        </div>
    );
}

export default App;
