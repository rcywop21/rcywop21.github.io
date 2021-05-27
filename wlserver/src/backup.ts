import logger from './logger';
import { saveGameState } from './startup';

const onBackup = (): void => {
    logger.log('info', 'Writing gameState to disk...');
    saveGameState();
};

export default onBackup;
