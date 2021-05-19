import React from 'react';
import Login from '../components/Login';
import './Admin.css';

export interface AdminProps {
    loggedIn: boolean;
    updateLoggedIn: (x: boolean) => void;
}

const Admin = (props: AdminProps): React.ReactElement => {
    const { loggedIn, updateLoggedIn } = props;
    const [output, setOutput] = React.useState('Test Content');

    if (!loggedIn) {
        return (
            <div>
                <Login updateLoggedIn={updateLoggedIn} mode="admin" />
            </div>
        );
    }

    return (
        <div className="admin">
            <div className="message">If you are not Lin Hong Sir, please exit immediately and inform him!</div>
            <br></br>
            <br></br>
            <div className="output"> { output }</div>
            <br></br>
            <input placeholder="For Lin Hong Sir to type"></input>
        </div>
    );
};

export default Admin;
