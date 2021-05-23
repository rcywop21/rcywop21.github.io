import React from 'react';
import TopBar from './TopBar/TopBar';
import LocationComponent from './Location/LocationComponent';
import BottomBar from './BottomBar/BottomBar';
import Journal from './Journal/Journal';
import OnActionPopup from './Popups/OnActionPopup';
import { TooltipType } from './Popups/Tooltip';
import Tooltip from './Popups/Tooltip';
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

    const [isTooltipVisible, setIsTooltipVisible] = React.useState<boolean>(false);
    const [tooltipType, setTooltipType] = React.useState<TooltipType>(null);
    const [tooltipData, setTooltipData] = React.useState<string>("");
    
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
    
    function triggerTooltip(type: TooltipType = null, data = "") {
        return () => {
            setIsTooltipVisible(!isTooltipVisible);
            if (type) {
                setTooltipType(type);
                setTooltipData(data);
            }
        };
    }
    
    const playerNotifs: Message[] = globalState.messages
        .filter(message => message.visibility === "all" || message.visibility === teamId);
    
    return (
        <div className="game">
            <TopBar 
                inventory={playerState.inventory} 
                oxygenUntil={playerState.oxygenUntil} 
                crimsonUntil={new Date()}
                triggerTooltip={triggerTooltip}
            />
            <LocationComponent 
                playerState={playerState} 
                handleAction={handleSpecificAction} 
                handleTravel={handleTravel} 
            />
            <OnActionPopup action={playerState.stagedAction} />
            <Tooltip 
                isVisible={isTooltipVisible}
                tooltipType={tooltipType}
                data={tooltipData}
            />
            <BottomBar
                key={playerNotifs.length}
                notifications={playerNotifs} 
                quests={playerState.quests} 
            />
            <Journal />
        </div>
    );
};

export default Game;
