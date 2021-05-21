import React from 'react';
import TopBar from './TopBar/TopBar';
import LocationComponent from './Location/LocationComponent';
import BottomBar from './BottomBar/BottomBar';
import Journal from './Journal/Journal';
import { Locations } from 'wlcommon';
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
    const testNotifs: string[] = [];
    let i = 0;
    while (i < 10) {
        testNotifs.push(i.toString() + "test".repeat(i));
        i++;
    }
    
    return (
        <div className="game">
            <TopBar inventory={["map", "map", "map","hueheuheuheuhe"]} oxygenLeft={300} oxygenRate={1} crimsonTime="2021-05-21T19:06:00.000+08:00" />
            <LocationComponent locationId={Locations.locationIds.SHALLOWS} />
            <BottomBar notifications={testNotifs} quests={null} />
            <Journal />
        </div>
    );
};

export default Game;
            