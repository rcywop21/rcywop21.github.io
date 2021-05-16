import React from 'react';
import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './pages/Main';
import Mentor from './pages/Mentor';
import Admin from './pages/Admin';
import { socket, SocketContext } from './socket/socket';

export interface AppProps {
    children?: React.ReactNode;
}

function App(): React.ReactElement {
    const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

    const [chapter, setChapter] = React.useState<number | undefined>(undefined);
    const [deadline, setDeadline] = React.useState<Date | null>(null);

    React.useEffect(() => () => {
        socket.disconnect();
        setLoggedIn(false)
    }, []);

    return (
        <Router>
            <SocketContext.Provider value={socket}>
                <div className="App">
                    <Header chapter={chapter} deadline={deadline} />
                    <Switch>
                        <Route path="/mentor">
                            <Mentor
                                loggedIn={loggedIn}
                                updateLoggedIn={setLoggedIn}
                            />
                        </Route>
                        <Route path="/">
                            <Main
                                loggedIn={loggedIn}
                                updateLoggedIn={setLoggedIn}/>
                        </Route>
                        <Route path="/admin">
                            <Admin
                                loggedIn={loggedIn}
                                updateLoggedIn={setLoggedIn}/>
                        </Route>
                    </Switch>
                </div>
            </SocketContext.Provider>
        </Router>
    );
}

export default App;
