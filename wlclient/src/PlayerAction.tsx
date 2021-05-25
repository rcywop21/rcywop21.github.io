import { PlayerState } from "wlcommon";

export type StatePredicate = (playerState: PlayerState) => boolean;

export class PlayerAction {
    description: string;
    task: string;
    x: string;
    y: string;
    getVisibility?: StatePredicate;
    getEnabled?: StatePredicate;
    isVisible: boolean;
    isEnabled: boolean;
    constructor(description: string, task: string, x: string, y: string, visibility?: StatePredicate, enabled?: StatePredicate) {
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
