import { TeamId } from "wlcommon";
import { notifyPlayerState } from "./connections";
import { applyTransform, gameState, killTransform } from "./stateMgr";

const onTick = (): void => {
    const currentTime = Date.now();

    for (let i = 0; i < gameState.players.length; ++i) {
        const playerId = i as TeamId;
        const playerState = gameState.players[playerId];

        if (playerState.oxygenUntil && playerState.oxygenUntil.valueOf() < currentTime) {
            applyTransform(killTransform, playerId);
            notifyPlayerState(playerId);
        }
    }
};

export default onTick;
