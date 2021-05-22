import React from 'react';
import { Locations, Actions } from 'wlcommon';
import './TravelPopup.css';

export interface TravelPopupProps {
    state: any;
    isVisible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleTravel: (a: Locations.LocationId) => () => void;
}

const TravelPopup = (props: TravelPopupProps): React.ReactElement => {
    const { state, isVisible, setVisible, handleTravel } = props;
    const visibility = isVisible ? 'inline' : 'none';
    const locationIds = Object.values(Locations.locationIds);

    function handleTravelClosePopup(id: Locations.LocationId) {
        return () => {
            setVisible(false);
            handleTravel(id)();
        };
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
                            return (
                                <button
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
