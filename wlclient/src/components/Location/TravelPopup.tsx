import React from 'react';
import { TooltipData, TooltipType, tooltipTypes } from '../Popups/Tooltip';
import { Locations, PlayerState } from 'wlcommon';
import './TravelPopup.css';

export interface TravelPopupProps {
    playerState: PlayerState;
    isVisible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleTravel: (a: Locations.LocationId) => () => void;
    triggerTooltip: (t?: TooltipType, d?: TooltipData, b?: boolean) => () => void;
}

function checkHiddenLocationRequirement(
    location: Locations.Location,
    playerState: PlayerState
): boolean {
    if (location.id == Locations.locationIds.ALCOVE) {
        return playerState.unlockedAlcove as boolean;
    } else if (location.id == Locations.locationIds.SHRINE) {
        return playerState.unlockedShrine as boolean;
    } else if (location.id == Locations.locationIds.WOODS) {
        return playerState.unlockedWoods as boolean;
    } else {
        return (
            playerState.hasMap ||
            !Locations.locationsMapping[location.id].needsMap
        );
    }
}

const TravelPopup = (props: TravelPopupProps): React.ReactElement => {
    const {
        playerState,
        isVisible,
        setVisible,
        handleTravel,
        triggerTooltip,
    } = props;

    const visibility = isVisible ? 'inline' : 'none';
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
        }

        const hiddenRequirement = checkHiddenLocationRequirement(
            location,
            playerState
        );
        const regionRequirement =
            Locations.locationsMapping[playerState.locationId].undersea ===
            Locations.locationsMapping[location.id].undersea;

        return hiddenRequirement && regionRequirement;
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
                            const display = {
                                display: travellable ? '' : 'none',
                            };
                            return (
                                <button
                                    className="travelButton"
                                    style={display}
                                    key={locationId}
                                    onClick={handleTravelClosePopup(
                                        location.id
                                    )}
                                    onMouseEnter={triggerTooltip(
                                        tooltipTypes.LOCATION,
                                        [location.id]
                                    )}
                                    onMouseLeave={triggerTooltip()}
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
