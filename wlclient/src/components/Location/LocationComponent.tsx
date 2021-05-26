import React from 'react';
import { Action, ActionProps } from './Action';
import TravelPopup from './TravelPopup';
import { TooltipType, tooltipTypes } from '../Popups/Tooltip';
import { GlobalState, Locations, PlayerState } from 'wlcommon';
import './LocationComponent.css';

import Shallows from './Shallows';
import Shores from './Shores';
import Corals from './Corals';
import Store from './Store';
import Woods from './Woods';
import Statue from './Statue';
import Library from './Library';
import Anchovy from './Anchovy';
import Barnacle from './Barnacle';
import Salmon from './Salmon';
import Kelp from './Kelp';
import Umbral from './Umbral';
import Tuna from './Tuna';
import Catfish from './Catfish';
import Bubble from './Bubble';
import Shrine from './Shrine';
import Alcove from './Alcove';

export interface LocationProps {
    globalState: GlobalState;
    playerState: PlayerState;
    handleAction: (a: string) => () => void;
    handleTravel: (a: Locations.LocationId) => () => void;
    triggerTooltip: (t?: TooltipType, d?: string[], b?: boolean) => () => void;
    isMentor?: boolean;
}

export interface SpecificLocationProps {
    globalState?: GlobalState;
    playerState: PlayerState;
    handleAction: (a: string) => () => void;
    triggerTooltip: (t?: TooltipType, d?: string[], b?: boolean) => () => void;
    isMentor?: boolean;
}

export function getSpecificLocationComponent(
    globalState: GlobalState,
    playerState: PlayerState,
    handleAction: (a: string) => () => void, 
    triggerTooltip: (t?: TooltipType, d?: string[], b?: boolean) => () => void,
    isMentor?: boolean): React.ReactElement {
        
    const specificLocationComponentProps = {
        globalState: globalState,
        playerState: playerState,
        handleAction: handleAction,
        triggerTooltip: triggerTooltip,
        isMentor: isMentor
    };
            
    const SPECIFIC_LOCATION_COMPONENT_MAP: Map<Locations.LocationId, React.ReactElement> = new Map([
        [
            Locations.locationIds.SHALLOWS, 
            <Shallows key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.SHORES, 
            <Shores key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.CORALS, 
            <Corals key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.STORE, 
            <Store key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.WOODS, 
            <Woods key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.STATUE, 
            <Statue key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.LIBRARY, 
            <Library key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.ANCHOVY, 
            <Anchovy key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.BARNACLE, 
            <Barnacle key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.SALMON, 
            <Salmon key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.KELP, 
            <Kelp key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.UMBRAL, 
            <Umbral key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.TUNA, 
            <Tuna key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.CATFISH, 
            <Catfish key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.BUBBLE, 
            <Bubble key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.SHRINE, 
            <Shrine key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.ALCOVE, 
            <Alcove key={Math.random.toString()} {...specificLocationComponentProps} />
        ],
    ]);
    
    const component = SPECIFIC_LOCATION_COMPONENT_MAP.get(playerState.locationId);
    if (!component) {
        return <React.Fragment></React.Fragment>;
    }
    return component;
}

export function imgDirectoryGenerator(imgFileName: string): string {
    return '/assets/locations/' + imgFileName;
}

const LocationComponent = (props: LocationProps): React.ReactElement => {
    const { globalState, playerState, handleAction, handleTravel, triggerTooltip, isMentor } = props;
    
    const location: Locations.Location = Locations.locationsMapping[playerState.locationId];
    
    const isTravelVisible = playerState.locationId != Locations.locationIds.SHORES || playerState.unlockedWoods == true;
    const [isTravelPopupVisible, setIsTravelPopupVisible] = React.useState(false);  
    const travelActionProps: ActionProps = {
        display: "Travel",
        action: "Travel",
        x: "870px",
        y: "433px",
        isVisible: isMentor ? true : isTravelVisible,
        isEnabled: isMentor ? isTravelVisible : true,
        handleAction: () => {
            if (!isMentor) {
                setIsTravelPopupVisible(true);
            }
        },
        triggerTooltip: triggerTooltip,
        tooltipInfo: ["Travel", "Go somewhere else in this wonderful world!", ""]
    }
    
    return (
        <div className="location">
            <div
                className="currLocationTitle"
                onMouseEnter={triggerTooltip(tooltipTypes.LOCATION, [playerState.locationId])}
                onMouseLeave={triggerTooltip()}
            ><span> {location.name} </span>
            </div>
            { getSpecificLocationComponent(globalState,
                playerState, handleAction, triggerTooltip, isMentor) }
            <Action {...travelActionProps} />
            <TravelPopup
                playerState={playerState}
                isVisible={isTravelPopupVisible} 
                setVisible={setIsTravelPopupVisible} 
                handleTravel={handleTravel} 
                triggerTooltip={triggerTooltip}
            />
        </div>
    );
};

export default LocationComponent;
