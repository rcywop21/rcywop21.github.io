import React from 'react';
import TopBar from './TopBar/TopBar';
import Location from './Location/Location';
import BottomBar from './BottomBar/BottomBar';
import Journal from './Journal/Journal';
import './Game.css';

export interface GameProps {
    groupId: string;
}

/*
    Organization of components:
        TopBar
            - Inventory
            - TopRightHUD
        Location
            - Background
            - Actions
            - Location bar
        BottomBar
            - Notifications
            - Quests
        Journal
            - Tabs
            - Contents {Journal, Notes, Oxygen}
        Popup?
            - Various popup windows
*/
    

const Game = (props: GameProps): React.ReactElement => {
    const { groupId } = props;
    
    //gamestate processing and listening
    
    return (
        <div className="game">
            <TopBar inventory={["map", "map", "map","hueheuheuheuhe"]} oxygenLeft={300} oxygenRate={1} crimsonTime="2021-05-21T19:06:00.000+08:00" />
            <Location />
            <BottomBar />
            <Journal />
        </div>
    );
};

export default Game;
            