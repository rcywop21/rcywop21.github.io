import React from 'react';
import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './pages/Main';
import Mentor from './pages/Mentor';

export interface AppProps {
    children?: React.ReactNode
}

function App(): React.ReactElement {
    
    const [chapter, setChapter] = React.useState<number | undefined>(undefined);
    const [deadline, setDeadline] = React.useState<Date | null>(null);

    return (
        <Router><div className="App">
            <Header
                chapter={chapter}
                deadline={deadline}
                />
            <Switch>
                <Route path="/mentor">
                    <Mentor 
                        chapter={chapter} 
                        setChapter={setChapter} 
                        deadline={deadline}
                        setDeadline={setDeadline}
                    />
                </Route>
                <Route path="/"><Main /></Route>
            </Switch>
        </div></Router>
    );
}

export default App;
