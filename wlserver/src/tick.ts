import { questIds, TeamId } from 'wlcommon';
import { notifyGameState, notifyPlayerState } from './connections';
import logger from './logger';
import { makeAddOxygenTransform } from './oxygen';
import { makeAdvanceQuestTransform } from './questRewards';
import {
    applyTransform,
    composite,
    gameState,
    killTransform,
    makeAddMessageTransform,
    makePlayerStatTransform,
    Transform,
} from './stateMgr';

const linkedStreamsTransform = composite(
    makeAddMessageTransform(
        'You have received 40 minutes of Oxygen from the linked Oxygen Streams.'
    ),
    makeAddOxygenTransform(2400, false)
);

const linkedStreamsFailTransform = makeAddMessageTransform(
    'The other end of the linked Oxygen Stream was not activated in time. You did not manage to get any Oxygen.'
);

const finishChallengeModeTransform: Transform = (state) =>
    composite(
        makeAddMessageTransform(
            'You have survived 30 minutes in Challenge Mode. Well done! Return to the Shrine of the Innocent to collect your reward.',
            {
                visibility: 'public',
                text: `[Announcement] Team ${
                    state.playerState.id
                } has completed Challenge Mode. (Difficulty: ${Math.max(
                    15,
                    12.5 + 0.25 * state.globalState.artefactsFound
                ).toFixed(1)}% Oxygen)`,
            }
        ),
        makeAdvanceQuestTransform(questIds.SHRINE_2, 4),
        makePlayerStatTransform('challengeMode', null)
    )(state);

const onTick = (): void => {
    const currentTime = Date.now();

    for (let i = 0; i < gameState.players.length; ++i) {
        const playerId = i as TeamId;
        const playerState = gameState.players[playerId];

        if (
            playerState.oxygenUntil &&
            playerState.oxygenUntil.valueOf() < currentTime
        ) {
            applyTransform(killTransform, playerId);
            logger.log('info', `Player ${playerId} ran out of Oxygen.`);
            notifyPlayerState(playerId);
        }

        if (
            playerState.challengeMode &&
            playerState.challengeMode.valueOf() <= currentTime &&
            playerState.quests[questIds.SHRINE_2]?.stages[3]
        ) {
            applyTransform(finishChallengeModeTransform, playerId);
        }
    }

    // delete outdated activations of linked streams
    if (
        gameState.global.linkedStreams.lastSalmonId !== undefined &&
        gameState.global.linkedStreams.lastSalmon &&
        currentTime - gameState.global.linkedStreams.lastSalmon.valueOf() >
            120000
    ) {
        const { lastSalmonId } = gameState.global.linkedStreams;
        delete gameState.global.linkedStreams.lastSalmonId;
        applyTransform(linkedStreamsFailTransform, lastSalmonId);
        notifyGameState();
    }

    if (
        gameState.global.linkedStreams.lastCatfishId !== undefined &&
        gameState.global.linkedStreams.lastCatfish &&
        currentTime - gameState.global.linkedStreams.lastCatfish.valueOf() >
            120000
    ) {
        const { lastCatfishId } = gameState.global.linkedStreams;
        delete gameState.global.linkedStreams.lastCatfishId;
        applyTransform(linkedStreamsFailTransform, lastCatfishId);
        notifyGameState();
    }

    // both ends activated
    if (
        gameState.global.linkedStreams.lastCatfishId &&
        gameState.global.linkedStreams.lastSalmonId
    ) {
        applyTransform(
            linkedStreamsTransform,
            gameState.global.linkedStreams.lastCatfishId
        );
        applyTransform(
            linkedStreamsTransform,
            gameState.global.linkedStreams.lastSalmonId
        );
        gameState.global.linkedStreams = {};
        notifyGameState();
    }
};

export default onTick;
