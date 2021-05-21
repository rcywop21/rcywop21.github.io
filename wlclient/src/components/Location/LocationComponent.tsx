import React from 'react';
import Action from './Action';
import { Locations, PlayerState } from 'wlcommon';
import './LocationComponent.css';

import Shallows from './Shallows';
import Shores from './Shores';
import Corals from './Corals';
import Store from './Store';
import Woods from './Woods';

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