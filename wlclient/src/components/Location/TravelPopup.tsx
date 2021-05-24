import React from 'react';
import { Locations, PlayerState } from 'wlcommon';
import './TravelPopup.css';

export interface TravelPopupProps {
    playerState: PlayerState
    isVisible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleTravel: (a: Locations.LocationId) => () => void;
}


const TravelPopup = (props: TravelPopupProps): React.ReactElement => {
    const { playerState, isVisible, setVisible, handleTravel } = props;
    const visibility = isVisible ? "inline" : "none";
    const locationIds = Object.values(Locations.locationIds);

    function handleTravelClosePopup(id: Locations.LocationId) {
        return () => {
            setVisible(false);
            handleTravel(id)();
        };
    }

    function canTravel(location: Locations.Location) {
        if (location.id == playerState.locationId) {
            return false;
        } else if (location.id == Locations.locationIds.ALCOVE) {
            return playerState.unlockedAlcove;
        } else if (location.id == Locations.locationIds.SHRINE) {
            return playerState.unlockedShrine;
        } else if (location.id == Locations.locationIds.WOODS) {
            return playerState.unlockedWoods;
        } else if (location.needsMap) {
            if (location.id == Locations.locationIds.STORE) {
                console.log(location);
            }
            return playerState.hasMap;
        } else if (playerState.locationId != Locations.locationIds.SHORES && playerState.locationId != Locations.locationIds.WOODS) {
            return location.id != Locations.locationIds.SHORES && location.id != Locations.locationIds.WOODS;
        } else {
            return true;
        }
    }

    return (
        <div style={{ display: visibility }}>
            <div
                className="backgroundShroud"
                onClick={() => setVisible(false)}
            ></div>
            <div className="travelPopup">
                <p>
                    <b>Travel</b> - Where would you like to go?
                </p>
                <div className="buttonContainer">
                    {locationIds.map(
                        (
                            locationId: Locations.LocationId
                        ): React.ReactElement => {
                            const location: Locations.Location =
                                Locations.locationsMapping[locationId];

                            const travellable = canTravel(location);
                            const display = { display: travellable ? "" : "none"}
                            return (
                                <button className="travelButton" style={display}
                                    key=""
                                    onClick={handleTravelClosePopup(
                                        location.id
                                    )}
                                >
                                    {location.name}
                                </button>
                            );
                        }
                    )}
                </div>
            </div>
        </div>
    );
};

export default TravelPopup;
