import React from 'react';
import './App.css';
import Header from './components/Header';

function App(): React.ReactElement {
    return (
        <div className="App">
            <Header chapter={1} deadline={new Date('2021-05-07T23:59:00')} />
            <div className="App-container">Test2</div>
        </div>
    );
}

export default App;
