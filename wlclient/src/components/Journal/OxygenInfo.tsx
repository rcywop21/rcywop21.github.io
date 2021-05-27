import React from 'react';
import { Actions, Locations, Util } from 'wlcommon';
import { allPlayerActions, DynamicPlayerAction } from '../../PlayerAction';
import { formatTime } from '../../util';

export type ChallengeModeParameter = number | 'vague' | null;

interface BaseOxygenEntryProps {
    locationId: Locations.LocationId;
    cooldown?: Date;
    addendum?: React.ReactNode;
    challengeMode: ChallengeModeParameter;
    oxygenInSeconds: number;
}

interface SpecialRequirementProps {
    enabled: boolean;
    disabledDescription: React.ReactNode;
}

export type OxygenEntryProps = BaseOxygenEntryProps &
    Partial<SpecialRequirementProps>;

const getChallengeModeDescription = (
    parameter: ChallengeModeParameter,
    seconds: number
): string | null => {
    if (parameter === null) return null;
    if (parameter === 'vague')
        return 'You are in Challenge Mode! You will receive less Oxygen from Oxygen Streams.';
    return `You are in Challenge Mode (Oxygen Multiplier ${(parameter * 100).toFixed(
        1
    )}%)! You will only receive ${Util.formatDuration(
        seconds * parameter * 1000
    )} of Oxygen.`;
};

const OxygenEntry = (props: OxygenEntryProps): React.ReactElement => {
    const {
        locationId,
        addendum,
        cooldown,
        enabled,
        disabledDescription,
        challengeMode,
        oxygenInSeconds,
    } = props;

    const [onCooldown, setOnCooldown] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (cooldown && cooldown.valueOf() > Date.now()) {
            setOnCooldown(true);
            const timeout = setTimeout(
                () => setOnCooldown(false),
                cooldown.valueOf() - Date.now() + 20
            );
            return () => clearTimeout(timeout);
        }
    }, [cooldown]);
    const locationInfo = Locations.locationsMapping[locationId];
    const dynamicPlayerAction = allPlayerActions[locationId][
        Actions.ALL_OXYGEN.GET_OXYGEN
    ] as DynamicPlayerAction;

    const streamEnabled = (enabled ?? true) && !onCooldown;

    const challengeModeDescription = getChallengeModeDescription(
        challengeMode,
        oxygenInSeconds
    );

    return (
        <div className="oxygen-entry">
            <h3 className={streamEnabled ? 'off-cooldown' : 'on-cooldown'}>
                {locationInfo.name}
            </h3>
            <div className="description">{dynamicPlayerAction.description}</div>
            {addendum}
            <div className="task">
                <b>Task:</b> {dynamicPlayerAction.task}
            </div>
            {challengeModeDescription && (
                <div className="cooldown on-cooldown">
                    {challengeModeDescription}
                </div>
            )}
            {streamEnabled && (
                <div className="cooldown off-cooldown">
                    This Oxygen Stream is available for you to use.
                </div>
            )}
            {enabled || (
                <div className="cooldown on-cooldown">
                    {disabledDescription}
                </div>
            )}
            {!enabled && onCooldown && (
                <div className="cooldown on-cooldown">
                    You can next use this Oxygen Stream at{' '}
                    {formatTime(cooldown ?? new Date(0))}
                </div>
            )}
        </div>
    );
};

export default OxygenEntry;
