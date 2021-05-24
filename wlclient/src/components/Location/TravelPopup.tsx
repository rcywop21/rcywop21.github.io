import React from 'react';
import { TooltipType, tooltipTypes } from '../Popups/Tooltip';
import { Locations } from 'wlcommon';
import './TravelPopup.css';

export interface TravelPopupProps {
    isVisible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleTravel: (a: Locations.LocationId) => () => void;
    triggerTooltip: (t?: TooltipType, d?: string[], b?: boolean) => () => void;
}

const TravelPopup = (props: TravelPopupProps): React.ReactElement => {
    const { isVisible, setVisible, handleTravel, triggerTooltip } = props;
    const visibility = isVisible ? "inline" : "none";
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
