import React from 'react';
import { Action, ActionProps } from './Action';
import TravelPopup from './TravelPopup';
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
}

export interface SpecificLocationProps {
    playerState: PlayerState;
    handleAction: (a: string) => () => void;
}

export function getSpecificLocationComponent(playerState: PlayerState,
    handleAction: (a: string) => () => void): React.ReactElement {
            
    const SPECIFIC_LOCATION_COMPONENT_MAP: Map<Locations.LocationId, React.ReactElement> = new Map([
        [Locations.locationIds.SHALLOWS, <Shallows key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.SHORES, <Shores key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.CORALS, <Corals key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.STORE, <Store key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.WOODS, <Woods key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.STATUE, <Statue key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.LIBRARY, <Library key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.ANCHOVY, <Anchovy key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.BARNACLE, <Barnacle key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.SALMON, <Salmon key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.KELP, <Kelp key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.UMBRAL, <Umbral key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.TUNA, <Tuna key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.CATFISH, <Catfish key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.BUBBLE, <Bubble key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.SHRINE, <Shrine key="" playerState={playerState} handleAction={handleAction} />],
        [Locations.locationIds.ALCOVE, <Alcove key="" playerState={playerState} handleAction={handleAction} />],
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
    const { playerState, handleAction, handleTravel } = props;
    
    const location: Locations.Location = Locations.locationsMapping[playerState.locationId];
    
    const isTravelVisible = playerState.locationId != Locations.locationIds.SHORES || playerState.unlockedWoods == true;
    
    const [isTravelPopupVisible, setIsTravelPopupVisible] = React.useState(false);  
    const travelActionProps: ActionProps = {
        action: "Travel",
        x: "870px",
        y: "433px",
        isVisible: isTravelVisible,
        isEnabled: true,
        handleAction: (): void => { setIsTravelPopupVisible(true); }
    }
    
    return (
        <div className="location">
            <p className="currLocationTitle">{location.name}</p>
            { getSpecificLocationComponent(playerState, handleAction) }
            <Action {...travelActionProps} />
            <TravelPopup
                isVisible={isTravelPopupVisible} 
                setVisible={setIsTravelPopupVisible} 
                handleTravel={handleTravel} />
        </div>
    );
};

export default LocationComponent;
