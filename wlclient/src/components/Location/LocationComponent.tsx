import React from 'react';
import Action from './Action';
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
    locationId: Locations.LocationId;
    handleAction: (a: string) => () => void;
}

export interface SpecificLocationProps {
    state: any;
    handleAction: (a: string) => () => void;
}

export function getSpecificLocationComponent(id: Locations.LocationId, 
        state: any, handleAction: (a: string) => () => void): React.ReactElement {
            
    const SPECIFIC_LOCATION_COMPONENT_MAP: Map<Locations.LocationId, React.ReactElement> = new Map([
        [Locations.locationIds.SHALLOWS, <Shallows key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.SHORES, <Shores key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.CORALS, <Corals key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.STORE, <Store key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.WOODS, <Woods key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.STATUE, <Statue key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.LIBRARY, <Library key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.ANCHOVY, <Anchovy key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.BARNACLE, <Barnacle key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.SALMON, <Salmon key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.KELP, <Kelp key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.UMBRAL, <Umbral key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.TUNA, <Tuna key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.CATFISH, <Catfish key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.BUBBLE, <Bubble key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.SHRINE, <Shrine key="" state={state} handleAction={handleAction} />],
        [Locations.locationIds.ALCOVE, <Alcove key="" state={state} handleAction={handleAction} />],
    ]);
    
    const component = SPECIFIC_LOCATION_COMPONENT_MAP.get(id);
    if (!component) {
        return (<React.Fragment></React.Fragment>);
    }
    return component;
}

export function imgDirectoryGenerator(imgFileName: string): string {
    return "/assets/locations/" + imgFileName;
}

const LocationComponent = (props: LocationProps): React.ReactElement => {
    const { locationId, handleAction } = props;
    
    const location: Locations.Location = Locations.locationsMapping[locationId];
    
    return (
        <div className="location">
            <p className="currLocationTitle">{location.name}</p>
            { getSpecificLocationComponent(locationId, {}, handleAction) }
        </div>
    );
}

export default LocationComponent;