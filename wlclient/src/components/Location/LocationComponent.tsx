import React from 'react';
import Action from './Action';
import { Locations } from 'wlcommon';
import './LocationComponent.css';

export interface LocationProps {
    locationId: Locations.LocationId;
}

const LOCATION_BACKGROUND_MAP: Map<Locations.LocationId, string> = new Map([
    [Locations.locationIds.SHALLOWS, "shallows.png"]
]);

const LOCATION_ACTIONS_MAP: Map<Locations.LocationId, string[][]> = new Map([
    [Locations.locationIds.SHALLOWS, [
        ["Explore", "360px", "239px"],
        ["Travel", "853px", "156px"]
    ]]    
]);

function getImg(item: Locations.LocationId): string {
    const imgFileName = LOCATION_BACKGROUND_MAP.get(item);
    
    if (!imgFileName) {
        return "";
    }
    
    const imgFileDirectory = "/assets/locations/";
    
    return imgFileDirectory + imgFileName;
}

function getActionsInfo(item: Locations.LocationId): string[][] {
    const actionsInfo = LOCATION_ACTIONS_MAP.get(item);
    
    if (!actionsInfo) {
        return [[]];
    }
    
    return actionsInfo;
}

const LocationComponent = (props: LocationProps): React.ReactElement => {
    const { locationId } = props;
    
    const location: Locations.Location = Locations.locationsMapping[locationId];
    const actionsInfo = getActionsInfo(locationId);
    
    return (
        <div className="location">
            <img src={getImg(locationId)} />
            <p className="currLocationTitle">{location.name}</p>
            { actionsInfo.map((item: string[]) => { return (
                <Action key= {item[0]} action={item[0]} x={item[1]} y={item[2]} />
            );}) }
        </div>
    );
}

export default LocationComponent;