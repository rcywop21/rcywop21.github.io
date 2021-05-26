import { PlayerState } from "wlcommon";
import { ActionProps } from "./components/Location/Action";
import { DynamicActionProps } from "./components/Location/DynamicAction";
import { ActionHandlerCreator, TooltipTrigger } from "./components/Location/LocationComponent";

export type StatePredicate = (playerState: PlayerState) => boolean;

export class PlayerAction {
    display: string;
    description: string;
    task: string;
    x: string;
    y: string;
    getVisibility?: StatePredicate;
    getEnabled?: StatePredicate;
    isVisible: boolean;
    isEnabled: boolean;
    constructor(display: string, description: string, task: string, x: string, y: string, visibility?: StatePredicate, enabled?: StatePredicate) {
        this.display = display;
        this.description = description;
        this.task = task;
        this.x = x;
        this.y = y;
        this.isVisible = true;
        this.isEnabled = true;
        this.getVisibility = visibility;
        this.getEnabled = enabled;
    }
}

export class DynamicPlayerAction extends PlayerAction {
    timeToCompare: (ps: PlayerState) => Date;
    howRecentToTrigger: number;
    triggerEffectsIfRecent: (v: ((b: boolean) => void), e: ((b: boolean) => void)) => void;
    triggerEffectsIfNotRecent: (v: ((b: boolean) => void), e: ((b: boolean) => void)) => void;
    
    constructor(
            display: string,
            description: string,
            task: string,
            x: string,
            y: string,
            timeToCompare: (ps: PlayerState) => Date,
            howRecentToTrigger: number,
            triggerEffectsIfRecent: (v: ((b: boolean) => void), e: ((b: boolean) => void)) => void,
            triggerEffectsIfNotRecent: (v: ((b: boolean) => void), e: ((b: boolean) => void)) => void,
            visibility?: StatePredicate,
            enabled?: StatePredicate
    ) {
        super(display, description, task, x, y, visibility, enabled);
        this.timeToCompare = timeToCompare;
        this.howRecentToTrigger = howRecentToTrigger;
        this.triggerEffectsIfRecent = triggerEffectsIfRecent;
        this.triggerEffectsIfNotRecent = triggerEffectsIfNotRecent;
    }
}
        
export const makeActionProps = (actions: Record<string, PlayerAction>, isMentor: boolean | undefined, playerState: PlayerState, handleAction: ActionHandlerCreator, triggerTooltip: TooltipTrigger): ActionProps[] => Object.entries(actions)
    .filter(([, playerAction]) => !(playerAction instanceof DynamicPlayerAction))
    .map(([actionId, playerAction]) => {

        const isVisible = playerAction.getVisibility ? playerAction.getVisibility(playerState) : true;

        const isEnabled = isVisible && (playerAction.getEnabled ? playerAction.getEnabled(playerState) : true);


        return {
            display: playerAction.display,
            action: actionId,
            x: playerAction.x,
            y: playerAction.y,
            isVisible: isVisible || !!isMentor,
            isEnabled,
            handleAction: handleAction(actionId),
            triggerTooltip: triggerTooltip,
            tooltipInfo: [playerAction.display, playerAction.description, playerAction.task]
        };
    });

export const makeDynamicActionProps = (actions: Record<string, PlayerAction>, isMentor: boolean | undefined, playerState: PlayerState, handleAction: ActionHandlerCreator, triggerTooltip: TooltipTrigger): DynamicActionProps[] => Object.entries(actions)
    .filter(([, playerAction]) => (playerAction instanceof DynamicPlayerAction))
    .map(([actionId, playerAction]) => {
        const dynamicPlayerAction = playerAction as DynamicPlayerAction;
        const isVisible = isMentor || (dynamicPlayerAction.getVisibility ? dynamicPlayerAction.getVisibility(playerState) : true);

        const isEnabled = isVisible && (dynamicPlayerAction.getEnabled ? dynamicPlayerAction.getEnabled(playerState) : true);
        console.log(actionId + ' ' + isEnabled);
        return {
            actionProps: {
                display: playerAction.display,
                action: actionId,
                x: dynamicPlayerAction.x,
                y: dynamicPlayerAction.y,
                isVisible,
                isEnabled,
                handleAction: handleAction(actionId),
                triggerTooltip: triggerTooltip,
                tooltipInfo: [playerAction.display, dynamicPlayerAction.description, dynamicPlayerAction.task]
            },
            timeToCompare: dynamicPlayerAction.timeToCompare(playerState),
            howRecentToTrigger: dynamicPlayerAction.howRecentToTrigger,
            triggerEffectsIfRecent: dynamicPlayerAction.triggerEffectsIfRecent,
            triggerEffectsIfNotRecent: dynamicPlayerAction.triggerEffectsIfNotRecent
        };
    });
