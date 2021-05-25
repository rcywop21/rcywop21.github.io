import React from 'react';
import { Locations, PlayerState, GlobalState } from 'wlcommon';
import './Oxygen.css';

export interface OxygenProps {
    playerState: PlayerState;
    globalState: GlobalState;
}

const Oxygen = (props: OxygenProps): React.ReactElement => {
    const { playerState, globalState } = props;
    
    const usedOxygenStreams = playerState.streamCooldownExpiry ? 
        Object.entries(playerState.streamCooldownExpiry)
            .filter(([id, expiry]) => (new Date(expiry)).valueOf() > Date.now()) :
        [];
        
    console.log(JSON.stringify(usedOxygenStreams));
    
    const allLocationIdsWithOxygen = Object.values(Locations.locationIds)
        .filter(id => Locations.locationsMapping[id].oxygenStream);
    allLocationIdsWithOxygen.sort();
        
    function isStreamAvailable(id: Locations.LocationId): boolean {
        return usedOxygenStreams.find(([locId, expiry]) => locId === id) ? false : true
    }
        
    function determineStyle(id: Locations.LocationId) {
        return isStreamAvailable(id) ? 
            "unusedOxygen" : 
            "usedOxygen";
    }
    
    function generateText(id: Locations.LocationId) {
        if (!isStreamAvailable(id)) {
            const timeReady = new Date(playerState.streamCooldownExpiry[id]);
            return `Unavailable - Ready for your use at ${timeReady.getHours()}:${timeReady.getMinutes()}`;
        } else {
            return "Available";
        }
    }
    
    const statueLastUsedTime = new Date(globalState.tritonOxygen.lastExtract);
    const statueLastUsed = `${statueLastUsedTime.getHours()}:${statueLastUsedTime.getMinutes()}`;
            
        
    return (
        <div>
            <h2 className="journalTitle">OXYGEN INFO</h2>
            <p className= "helptext">Here&apos;s information regarding the oxygen streams</p>
            { allLocationIdsWithOxygen.map(id => {
                return (
                    <div key={id} className={determineStyle(id)}>
                        <h3 className="subtitle">
                            {Locations.locationsMapping[id].name}
                        </h3>
                        <p className="text">
                            {generateText(id)}<br />
                            {id === Locations.locationIds.STATUE ? 
                                `Last used by someone (could be another group) at ${statueLastUsed}` : 
                                ""}
                        </p>
                    </div>
                ); 
            }) }
        </div>
    );
}

export default Oxygen;