export class PlayerAction {
    description: string;
    task: string;
    x: string;
    y: string;
    isVisible: boolean;
    isEnabled: boolean;
    constructor(description: string, task: string, x: string, y: string) {
        this.description = description;
        this.task = task;
        this.x = x;
        this.y = y;
        this.isVisible = true;
        this.isEnabled = true;
    }
}