import React from 'react';
import TopBar from './TopBar/TopBar';
import LocationComponent from './Location/LocationComponent';
import BottomBar from './BottomBar/BottomBar';
import Journal from './Journal/Journal';
import { Locations, Actions, PlayerState, GlobalState } from 'wlcommon';
import './Game.css';
import { socket } from '../socket/socket';

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
    const [ playerState, setPlayerState ] = React.useState(undefined);
    const [ globalState, setGlobalState ] = React.useState(undefined);
    
    //gamestate processing and listening
    React.useEffect(() => {
        socket.on('player_update', (newGameState: React.SetStateAction<undefined>) => {
            console.log(newGameState);
            setPlayerState(newGameState) 
        });
        socket.on('global_update', (newGameState: React.SetStateAction<undefined>) => {
            console.log(newGameState);
            setGlobalState(newGameState)
        });
    }, []);
    
    /*
    if (playerState === undefined || globalState === undefined) {
        return <p>How???</p>
    }
    */

    const handleAction = (action: string) => {
        console.log(action);
        socket.emit("action", action, (
            eventType: string,
            payload: string | Record<string, unknown>
        ) => {
            if (eventType == "error") {
                console.log("Error: " + payload);
            } else if (eventType == "info") {
                console.log("Info: " + payload);
            }
        });
    }
    
    function handleSpecificAction(action: string) {
        return () => handleAction(action);
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
            <TopBar inventory={["map", "map", "map","hueheuheuheuhe"]} oxygenLeft={300} oxygenRate={1} crimsonTime={"2021-05-22T19:06:00.000+08:00"} />
            <LocationComponent locationId={Locations.locationIds.STATUE} handleAction={handleSpecificAction} />
            <BottomBar notifications={testNotifs} quests={null} />
            <Journal />
        </div>
    );
};

export default Game;
            
