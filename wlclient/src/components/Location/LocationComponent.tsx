import React from 'react';
import { Action, ActionProps } from './Action';
import TravelPopup from './TravelPopup';
import { TooltipType, tooltipTypes } from '../Popups/Tooltip';
import { Locations, PlayerState } from 'wlcommon';
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
    playerState: PlayerState;
    handleAction: (a: string) => () => void;
    handleTravel: (a: Locations.LocationId) => () => void;
    triggerTooltip: (t?: TooltipType, d?: string[], b?: boolean) => () => void;
}

export interface SpecificLocationProps {
    playerState: PlayerState;
    handleAction: (a: string) => () => void;
    triggerTooltip: (t?: TooltipType, d?: string[], b?: boolean) => () => void;
}

export function getSpecificLocationComponent(playerState: PlayerState,
    handleAction: (a: string) => () => void, 
    triggerTooltip: (t?: TooltipType, d?: string[], b?: boolean) => () => void): React.ReactElement {
        
    const specificLocationComponentProps = {
        playerState: playerState,
        handleAction: handleAction,
        triggerTooltip: triggerTooltip
    };
            
    const SPECIFIC_LOCATION_COMPONENT_MAP: Map<Locations.LocationId, React.ReactElement> = new Map([
        [
            Locations.locationIds.SHALLOWS, 
            <Shallows key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.SHORES, 
            <Shores key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.CORALS, 
            <Corals key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.STORE, 
            <Store key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.WOODS, 
            <Woods key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.STATUE, 
            <Statue key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.LIBRARY, 
            <Library key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.ANCHOVY, 
            <Anchovy key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.BARNACLE, 
            <Barnacle key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.SALMON, 
            <Salmon key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.KELP, 
            <Kelp key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.UMBRAL, 
            <Umbral key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.TUNA, 
            <Tuna key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.CATFISH, 
            <Catfish key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.BUBBLE, 
            <Bubble key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.SHRINE, 
            <Shrine key="" {...specificLocationComponentProps} />
        ],
        [
            Locations.locationIds.ALCOVE, 
            <Alcove key="" {...specificLocationComponentProps} />
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
    const { playerState, handleAction, handleTravel, triggerTooltip } = props;
    
    const location: Locations.Location = Locations.locationsMapping[playerState.locationId];
    
    const isTravelVisible = playerState.locationId != Locations.locationIds.SHORES || playerState.unlockedWoods == true;
    
    const [isTravelPopupVisible, setIsTravelPopupVisible] = React.useState(false);  
    const travelActionProps: ActionProps = {
        action: "Travel",
        x: "870px",
        y: "433px",
        isVisible: isTravelVisible,
        isEnabled: true,
        handleAction: (): void => { setIsTravelPopupVisible(true); },
        triggerTooltip: triggerTooltip,
        tooltipInfo: ["Travel", "Go somewhere else in this wonderful world!", ""]
    }
    
    return (
        <div className="location">
            <p 
                className="currLocationTitle"
                onMouseEnter={triggerTooltip(tooltipTypes.LOCATION, [playerState.locationId])}
                onMouseLeave={triggerTooltip()}
            >
                {location.name}
            </p>
            { getSpecificLocationComponent(playerState, handleAction, triggerTooltip) }
            <Action {...travelActionProps} />
            <TravelPopup
                isVisible={isTravelPopupVisible} 
                setVisible={setIsTravelPopupVisible} 
                handleTravel={handleTravel} 
                triggerTooltip={triggerTooltip}
            />
        </div>
    );
};

export default LocationComponent;
