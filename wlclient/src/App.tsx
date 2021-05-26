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

export interface LoginMode {
    teamId: number;
    mode: 'player' | 'admin' | 'mentor';
}

function App(): React.ReactElement {
    const [loggedIn, setLoggedIn] = React.useState<LoginMode | undefined>(undefined);

    React.useEffect(
        () => () => {
            socket.disconnect();
            setLoggedIn(undefined);
        },
        []
    );

    return (
        <Router>
            <SocketContext.Provider value={socket}>
                <div className="App">
                    <Header loginMode={loggedIn} />
                    <Switch>
                        <Route path="/mentor">
                            <Mentor updateLoggedIn={setLoggedIn} />
                        </Route>
                        <Route path="/admin">
                            <Admin
                                loggedIn={loggedIn !== undefined}
                                updateLoggedIn={setLoggedIn}
                            />
                        </Route>
                        <Route path="/">
                            <Main updateLoggedIn={setLoggedIn} />
                        </Route>
                    </Switch>
                </div>
            </SocketContext.Provider>
        </Router>
    );
}

export default App;
