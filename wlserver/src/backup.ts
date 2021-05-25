import { saveGameState } from "./startup"

const onBackup = (): void => {
    saveGameState();
}

export default onBackup;
