import React from 'react';
import Action from './Action';
import { ActionProps } from './Action';

export interface DynamicActionProps {
    actionProps: ActionProps;
    timeToCompare: Date;
    howRecentToTrigger: number;
    triggerEffectsIfRecent: (v: ((b: boolean) => void), e: ((b: boolean) => void)) => void;
    triggerEffectsIfNotRecent: (v: ((b: boolean) => void), e: ((b: boolean) => void)) => void;
}

const DynamicAction = (props: DynamicActionProps): React.ReactElement => {
    const { actionProps, timeToCompare, howRecentToTrigger, triggerEffectsIfNotRecent, triggerEffectsIfRecent } = props;

    // when current time has passed timeToCompare
    const [timeToCompareIsInThePast, setTimeToCompareIsInThePast] = React.useState<boolean>(true);
    
    const stateControlledVisible: boolean = actionProps.isVisible;
    const stateControlledEnabled: boolean = actionProps.isEnabled;

    const [timeControlledVisible, setTimeControlledVisible] = React.useState<boolean>(stateControlledVisible);
    const [timeControlledEnabled, setTimeControlledEnabled] = React.useState<boolean>(stateControlledEnabled);

    React.useEffect(() => {
        if (timeToCompare.valueOf() - Date.now() > howRecentToTrigger) {
            triggerEffectsIfNotRecent(setTimeControlledVisible, setTimeControlledEnabled);
            const timer = setTimeout(() => {
                setTimeToCompareIsInThePast(timeToCompare.valueOf() - Date.now() < howRecentToTrigger)
                triggerEffectsIfRecent(setTimeControlledVisible, setTimeControlledEnabled);
            }, timeToCompare.valueOf() - Date.now() - howRecentToTrigger + 20);

            return () => clearTimeout(timer);
        } else {
            triggerEffectsIfRecent(setTimeControlledVisible, setTimeControlledEnabled);
        }
    }, [timeToCompareIsInThePast, timeToCompare, howRecentToTrigger, triggerEffectsIfRecent, triggerEffectsIfNotRecent]);

    const finalIsVisible = timeControlledVisible && stateControlledVisible;
    const finalIsEnabled = timeControlledEnabled && stateControlledEnabled;

    return <Action {...actionProps} isVisible={finalIsVisible} isEnabled={finalIsEnabled} />;
}

export default DynamicAction;
