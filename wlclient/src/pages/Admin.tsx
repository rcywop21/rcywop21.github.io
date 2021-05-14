import React from 'react';
import Login from '../components/Login';

export interface AdminProps {
    loggedIn: boolean;
    updateLoggedIn: (x: boolean) => void;
}

const Admin = (props: AdminProps): React.ReactElement => {
    const { loggedIn, updateLoggedIn } = props;

    if (!loggedIn) {
        return (
            <div>
                <Login updateLoggedIn={updateLoggedIn} mode="admin" />
            </div>
        );
    }

    return <div>Logged in! WIP</div>;
};

export default Admin;
