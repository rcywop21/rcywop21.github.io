import React from 'react';
import TopBar from './TopBar/TopBar';
import LocationComponent from './Location/LocationComponent';
import BottomBar from './BottomBar/BottomBar';
import Journal from './Journal/Journal';
import { PlayerState, GlobalState } from 'wlcommon';
import './Game.css';

export interface GameProps {
    globalState: GlobalState;
    playerState: PlayerState;
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
    const { globalState, playerState} = props;
    
    function handleSpecificAction(action: string) {
        return () => handleAction(action);
    }

    function handleAction(action: string) {
        console.log(action);
    }
    
    const testNotifs: string[] = [];
    let i = 0;
    while (i < 10) {
        testNotifs.push(i.toString() + "test".repeat(i));
        i++;
    }
    //testNotifs.push("999" + playerState.oxygenUntil.toString());
    
    return (
        <div className="game">
            <TopBar inventory={["map", "map", "map","hueheuheuheuhe"]} oxygenUntil={playerState.oxygenUntil} crimsonUntil={new Date()} />
            <LocationComponent locationId={playerState.locationId} handleAction={handleSpecificAction} />
            <BottomBar notifications={testNotifs} quests={null} />
            <Journal />
        </div>
    );
};

export default Game;
            
