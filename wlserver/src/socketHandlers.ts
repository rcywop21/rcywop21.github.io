import { Socket as BaseSocket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Actions } from "wlcommon";
import { getCredentials } from "./connections";
import { gameState } from "./stateMgr";

export type Socket = BaseSocket<DefaultEventsMap, DefaultEventsMap>;

export type SimpleReplyEvent = 'error' | 'staged' | 'ok' | 'auth_ok';
export type SimpleReply = (event: SimpleReplyEvent, msg: string) => void;

export type SocketHandler<P> = (socket: Socket, payload: P, reply: SimpleReply) => Promise<void>;

export const onActionHandler: SocketHandler<Actions.Action> = async (socket, payload, reply) => {
    const credentials = getCredentials(socket.id);
    if (credentials === undefined) return reply('error', 'Not authenticated');
    if (gameState.players[credentials.groupNum].stagedAction)
        return reply('error', 'Wait for the current action to be accepted or rejected first.');

    gameState.players[credentials.groupNum].stagedAction = payload;
    reply('ok', 'Action staged, now waiting for action to be accepted or rejected.');
}

