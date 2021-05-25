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
    function determineIfRecent() {
        return (timeToCompare.valueOf() - Date.now()) < howRecentToTrigger;
    }
    
    const [isRecent, setIsRecent] = React.useState<boolean>(determineIfRecent);
    
    let initialIsVisible: boolean = actionProps.isVisible;
    let initialIsEnabled: boolean = actionProps.isEnabled;
    const setInitialIsVisible = (b: boolean): void => { initialIsVisible = b; };
    const setInitialIsEnabled = (b: boolean): void => { initialIsEnabled = b; };
    determineIfRecent() ? 
        triggerEffectsIfRecent(setInitialIsVisible, setInitialIsEnabled) :
        triggerEffectsIfNotRecent(setInitialIsVisible, setInitialIsEnabled);
        
    const [isVisible, setIsVisibleDispatch] = React.useState<boolean>(initialIsVisible);
    const [isEnabled, setIsEnabledDispatch] = React.useState<boolean>(initialIsEnabled);
    const setIsVisible = (b: boolean): void => setIsVisibleDispatch(b);
    const setIsEnabled = (b: boolean): void => setIsEnabledDispatch(b);

    React.useEffect(() => {
        if (!isRecent) {
            const timer = setTimeout(() => {
                setIsRecent(determineIfRecent)
                triggerEffectsIfRecent(setIsVisible, setIsEnabled);
            }, (timeToCompare.valueOf() - Date.now()) - howRecentToTrigger + 20);
            
            return () => clearTimeout(timer);
        }
    }, [isRecent, timeToCompare]);
    
    actionProps.isVisible = isVisible && initialIsVisible;
    actionProps.isEnabled = isEnabled && initialIsEnabled;
    return <Action {...actionProps}/>;
}

export default DynamicAction;