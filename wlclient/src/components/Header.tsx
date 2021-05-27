import React from 'react';
import { LoginMode } from '../App';
import './Header.css';

export interface HeaderProps {
    loginMode: LoginMode | undefined;
}

const makeSuffix = (loginMode?: LoginMode) => {
    if (!loginMode) return '';
    if (loginMode.mode === 'admin') return '(Admin)';
    return `(Team ${loginMode.teamId}${
        loginMode.mode === 'mentor' ? ' Mentor' : ''
    })`;
};

const Header = (props: HeaderProps): React.ReactElement => {
    const { loginMode } = props;

    return (
        <header className="App-header">
            <div className="title">Ex Wanderlust {makeSuffix(loginMode)}</div>
        </header>
    );
};

export default Header;
