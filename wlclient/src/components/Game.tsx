import React from 'react';
import TopBar from './TopBar/TopBar';
import LocationComponent from './Location/LocationComponent';
import BottomBar from './BottomBar/BottomBar';
import Journal from './Journal/Journal';
import { PlayerState, GlobalState, Locations, Message } from 'wlcommon';
import './Game.css';
import { SocketContext } from '../socket/socket';

export interface GameProps {
    globalState: GlobalState;
    playerState: PlayerState;
    teamId: number;
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
    const { globalState, playerState, teamId } = props;

    const socket = React.useContext(SocketContext);
    
    function handleSpecificAction(action: string) {
        return () => handleAction(action);
    }

    function handleAction(action: string) {
        socket?.emit('action', action);
    }
    
    function handleTravel(location: Locations.LocationId) {
        return () => socket?.emit('travel', location);
    }
    
    const testNotifs: string[] = [];
    let i = 0;
    while (i < 10) {
        testNotifs.push(i.toString() + "test".repeat(i));
        i++;
    }
    
    const playerNotifs: Message[] = globalState.messages
        .filter(message => message.visibility === "all" || message.visibility === teamId)
    //testNotifs.push("999" + playerState.oxygenUntil.toString());
    
    return (
        <div className="game">
            <TopBar inventory={["map", "map", "map","hueheuheuheuhe"]} oxygenUntil={playerState.oxygenUntil} crimsonUntil={new Date()} />
            <LocationComponent 
                locationId={playerState.locationId} 
                handleAction={handleSpecificAction} 
                handleTravel={handleTravel} />
            <BottomBar notifications={playerNotifs} quests={null} />
            <Journal />
        </div>
    );
};

export default Game;
            
