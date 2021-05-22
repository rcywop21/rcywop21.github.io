import { Locations, QuestId, TeamId } from 'wlcommon';
import applyAction, {
    makeAdvanceQuestTransform,
    makeIssueQuestTransform,
} from './actions';
import {
    getCredentials,
    notifyGameState,
    notifyPlayerState,
} from './connections';
import { makeAddOxygenTransform } from './oxygen';
import { Reply, SocketHandler } from './socketHandlers';
import { applyTransform, gameState, setAction } from './stateMgr';

const commands = {
    state: (payload: string[], reply: Reply): void => {
        if (payload.length === 0) reply('cmdok', JSON.stringify(gameState));

        if (payload[0] === 'help') {
            reply(
                'cmdhelp',
                `Valid keys are: ${Object.keys(gameState).join(', ')}`
            );
            return;
        }

        const component = payload[0].split('.').reduce((curr, next) => {
            if (curr === undefined) return curr;
            return curr[next];
        }, gameState);

        if (component === undefined) {
            reply(
                'error',
                `Did not find component ${payload[1]} in game state.`
            );
            return;
        }

        if (payload[1] === 'help') {
            reply(
                'cmdhelp',
                `Valid keys are ${Object.keys(component).join(', ')}`
            );
            return;
        }

        reply('cmdok', JSON.stringify(component));
    },
    setglobal: (payload: string[], reply: Reply): void => {
        switch (payload[0]) {
            case undefined:
                throw 'Command incomplete.';

            case 'crimsonMasterSwitch':
                switch (payload[1]) {
                    case undefined:
                    case 'toggle':
                        gameState.global.crimsonMasterSwitch = !gameState.global
                            .crimsonMasterSwitch;
                        break;
                    case 'true':
                        gameState.global.crimsonMasterSwitch = true;
                        break;
                    case 'false':
                        gameState.global.crimsonMasterSwitch = false;
                        break;
                    default:
                        throw `Unknown option ${payload[1]}.`;
                }
                reply('cmdok', 'Option set.');
                break;

            default:
                throw `Unknown option ${payload[0]}.`;
        }
        notifyGameState();
    },
    setaction: (payload: string[], reply: Reply): void => {
        const playerId = getPlayerId(payload);
        const action = payload.pop();
        setAction(
            playerId,
            action === 'clear' || action === 'null' || action === undefined
                ? null
                : action
        );
        reply('cmdok', `Action set to ${action}.`);
        notifyPlayerState(playerId);
    },
    approve: (payload: string[], reply: Reply) => {
        const playerId = getPlayerId(payload);
        applyTransform(applyAction, playerId);
        reply('cmdok', 'Action approved.');
        notifyPlayerState(playerId);
    },
    issuequest: (payload: string[], reply: Reply) => {
        const playerId = getPlayerId(payload);
        const questId = parseInt(payload.shift()) as QuestId;
        if (questId === null || questId === undefined || Number.isNaN(questId))
            throw `Invalid quest ID ${questId}.`;
        applyTransform(makeIssueQuestTransform(questId), playerId);
        reply('cmdok', 'Quest issued.');
        notifyPlayerState(playerId);
    },
    advance: (payload: string[], reply: Reply) => {
        const playerId = getPlayerId(payload);
        const questId = parseInt(payload.shift()) as QuestId;
        const stage = parseInt(payload.shift());
        if (
            questId === null ||
            questId === undefined ||
            stage === undefined ||
            Number.isNaN(questId) ||
            Number.isNaN(stage)
        )
            throw `Invalid quest ID ${questId} or stage ${stage}.`;
        applyTransform(
            makeAdvanceQuestTransform(questId, stage, true),
            playerId
        );
        reply('cmdok', 'Quest advanced.');
        notifyPlayerState(playerId);
    },
    move: (payload: string[], reply: Reply) => {
        const playerId = getPlayerId(payload);
        const destination = payload.shift() as Locations.LocationId;
        if (!Locations.locationsMapping[destination])
            throw `Invalid location ${destination}.`;
        gameState.players[playerId].locationId = destination;
        reply('cmdok', 'Player moved.');
        notifyPlayerState(playerId);
    },
    oxygen: (payload: string[], reply: Reply) => {
        const playerId = getPlayerId(payload);
        const delta = parseInt(payload.shift());
        if (Number.isNaN(delta)) {
            throw `Invalid delta ${delta}.`;
        }
        applyTransform(makeAddOxygenTransform(delta), playerId);
        reply('cmdok', 'Oxygen added.');
        notifyPlayerState(playerId);
    },
    resetcd: (payload: string[], reply: Reply) => {
        const playerId = getPlayerId(payload);
        const oxygenStream = payload.shift() ?? 'all';
        if (oxygenStream === 'all') {
            gameState.players[playerId].streamCooldownExpiry = {};
        } else {
            delete gameState.players[playerId].streamCooldownExpiry[
                oxygenStream
            ];
        }
        reply('cmdok', `Cooldown reset for stream ${oxygenStream}.`);
        notifyPlayerState(playerId);
    },
};

export const onAdminHandler: SocketHandler<string[]> = async (
    socket,
    payload,
    reply
) => {
    const credentials = getCredentials(socket.id);
    if (credentials?.clientType !== 'admin')
        return reply('error', 'Not authenticated.');

    const command = payload.shift();

    try {
        if (command === 'help') {
            reply(
                'cmdhelp',
                `Valid commands are: ${Object.keys(commands).join(', ')}`
            );
            return;
        }

        const func = commands[command];
        if (func === undefined) throw `${command} is not a known command.`;

        func(payload, reply);
    } catch (e) {
        reply('error', e);
    }
};

const getPlayerId = (payload: string[]): TeamId => {
    const playerId = parseInt(payload.shift()) as TeamId;
    if (Number.isNaN(playerId) || playerId === null)
        throw `Unknown player ${playerId}`;
    return playerId;
};
