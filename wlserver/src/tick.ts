import { TeamId } from "wlcommon";
import { notifyPlayerState } from "./connections";
import logger from "./logger";
import { applyTransform, gameState, killTransform } from "./stateMgr";

const onTick = (): void => {
    const currentTime = Date.now();

    for (let i = 0; i < gameState.players.length; ++i) {
        const playerId = i as TeamId;
        const playerState = gameState.players[playerId];

        if (playerState.oxygenUntil && playerState.oxygenUntil.valueOf() < currentTime) {
            applyTransform(killTransform, playerId);
            logger.log('info', `Player ${playerId} ran out of Oxygen.`)
            notifyPlayerState(playerId);
        }
    }
};

export default onTick;
