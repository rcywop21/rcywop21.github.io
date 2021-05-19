import { TeamId } from "wlcommon";
import applyAction from "./actions";
import { getCredentials } from "./connections"
import { Reply, SocketHandler } from "./socketHandlers";
import { applyReducer, gameState, setAction } from "./stateMgr";

const commands = {
    state: (payload: string[], reply: Reply): void => {
        if (payload.length === 0)
            reply('cmdok', JSON.stringify(gameState));

        if (payload[0] === 'help') {
            reply('cmdhelp', `Valid keys are: ${Object.keys(gameState).join(', ')}`);
            return;
        }

        const component = payload[0].split('.').reduce((curr, next) => {
            if (curr === undefined) return curr;
            return curr[next];
        }, gameState)

        if (component === undefined) {
            reply('error', `Did not find component ${payload[1]} in game state.`);
            return;
        }

        if (payload[1] === 'help') {
            reply('cmdhelp', `Valid keys are ${Object.keys(component).join(', ')}`);
            return;
        }

        reply('cmdok', JSON.stringify(component));
    },
    setglobal: (payload: string[], reply: Reply): void => {
        switch (payload[0]) {
            case undefined:
                return reply('error', 'Command incomplete.');

            case 'crimsonMasterSwitch':
                switch (payload[1]) {
                    case undefined:
                    case 'toggle':
                        gameState.global.crimsonMasterSwitch = !gameState.global.crimsonMasterSwitch;
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
                return reply('cmdok', 'Option set.');

            default:
                throw `Unknown option ${payload[0]}.`
        }
    },
    setaction: (payload: string[], reply: Reply): void => {
        const playerId = getPlayerId(payload);
        const action = payload.pop();
        setAction(playerId, (action === 'clear' || action === 'null') ? null : action);
        reply('cmdok', `Action set to ${action}.`)
    },
    approve: (payload: string[], reply: Reply) => {
        const playerId = getPlayerId(payload);
        applyReducer(applyAction, playerId);
        reply('cmdok', 'Action approved.');
    }
}


export const onAdminHandler: SocketHandler<string[]> = async (socket, payload, reply) => {
    const credentials = getCredentials(socket.id);
    if (credentials?.clientType !== 'admin')
        return reply('error', 'Not authenticated.');

    const command = payload.shift();

    try {
        if (command === 'help') {
            reply('cmdhelp', `Valid commands are: ${Object.keys(commands).join(', ')}`);
            return;
        }

        const func = commands[command];
        if (func === undefined)
            throw `${command} is not a known command.`;

        func(payload, reply);
    } catch (e) {
        reply('error', e);
    }
}

const getPlayerId = (payload: string[]): TeamId => {
    const playerId = parseInt(payload.shift()) as TeamId;
    if (Number.isNaN(playerId) || playerId === null)
        throw `Unknown player ${playerId}`;
    return playerId;
}
