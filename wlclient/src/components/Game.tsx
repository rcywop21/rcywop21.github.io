import React from 'react';
import TopBar from './TopBar/TopBar';
import LocationComponent from './Location/LocationComponent';
import BottomBar from './BottomBar/BottomBar';
import Journal from './Journal/Journal';
import OnActionPopup from './Popups/OnActionPopup';
import {
    OnActionPopupProps,
    OnActionPopupMentorProps,
} from './Popups/OnActionPopup';
import { TooltipData, TooltipType } from './Popups/Tooltip';
import Tooltip from './Popups/Tooltip';
import { PlayerState, GlobalState, Locations, Message } from 'wlcommon';
import './Game.css';
import { SocketContext } from '../socket/socket';

export interface GameProps {
    globalState: GlobalState;
    playerState: PlayerState;
    teamId: number;
    isMentor?: boolean;
    gameMentorProps?: GameMentorProps;
}

export interface GameMentorProps {
    onActionPopupMentorProps: OnActionPopupMentorProps;
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
    const {
        globalState,
        playerState,
        teamId,
        isMentor,
        gameMentorProps,
    } = props;

    const [isTooltipVisible, setIsTooltipVisible] = React.useState<boolean>(
        false
    );
    const [tooltipType, setTooltipType] = React.useState<TooltipType>(null);
    const [tooltipData, setTooltipData] = React.useState<TooltipData>(['']);
    const [isTooltipRightSide, setIsTooltipRightSide] = React.useState<boolean>(
        true
    );

    const socket = React.useContext(SocketContext);

    function handleSpecificAction(action: string) {
        return () => handleAction(action);
    }

    function handleAction(action: string) {
        if (!isMentor) {
            socket?.emit('action', action);
        }
    }

    function handleTravel(location: Locations.LocationId) {
        return () => socket?.emit('travel', location);
    }

    function triggerTooltip(
        type: TooltipType = null,
        data: TooltipData = [''],
        isRightSide = true
    ) {
        return () => {
            setIsTooltipVisible(type ? true : false);
            
            if (type) {
                setTooltipType(type);                
                setTooltipData(data);

                setIsTooltipRightSide(isRightSide);
            }
        };
    }

    const playerNotifs: Message[] = globalState.messages.filter(
        (message) =>
            message.visibility === 'all' || message.visibility === teamId
    );

    const onActionPopupProps: OnActionPopupProps = {
        action: playerState.stagedAction,
        playerState: playerState,
        isMentor: isMentor,
    };

    if (isMentor && gameMentorProps) {
        onActionPopupProps.mentorProps =
            gameMentorProps.onActionPopupMentorProps;
    }
    
    //dev
    const tprops = {
        isVisible: isTooltipVisible,
        tooltipType: tooltipType,
        data: tooltipData.toString(),
        isRightSide: isTooltipRightSide
    };
    console.log(tprops);

    return (
        <div className={`game ${isMentor ? 'smallTopGap' : 'bigTopGap'}`}>
            <TopBar
                inventory={playerState.inventory}
                oxygenUntil={playerState.oxygenUntil}
                challengeMode={playerState.challengeMode}
                crimsonUntil={new Date()}
                triggerTooltip={triggerTooltip}
            />
            <LocationComponent
                globalState={globalState}
                playerState={playerState}
                handleAction={handleSpecificAction}
                handleTravel={handleTravel}
                triggerTooltip={triggerTooltip}
                isMentor={isMentor}
            />
            <OnActionPopup
                action={playerState.pausedOxygen ? 'pause' : null}
                isMentor={isMentor}
                playerState={playerState}
            />
            <OnActionPopup {...onActionPopupProps} />
            <Tooltip
                isVisible={isTooltipVisible}
                tooltipType={tooltipType}
                data={tooltipData}
                isRightSide={isTooltipRightSide}
                setVisible={setIsTooltipVisible}
            />
            <BottomBar
                key={playerNotifs.length}
                notifications={playerNotifs}
                quests={playerState.quests}
            />
            <Journal
                isMentor={isMentor}
                playerState={playerState}
                globalState={globalState}
            />
        </div>
    );
};

export default Game;
