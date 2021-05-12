import { createHash } from "crypto";
import { FileHandle, open } from "fs/promises";
import logger from "./logger";

export type ClientType = 'player' | 'mentor' | 'admin';

const AUTH_DETAILS = 'env/users.json';

interface AuthEntry {
    id: number;
    pass: string;
}

export interface AuthToken {
    id: number;
    type: ClientType;
    payload: string;
    validUntil: number;
}

const h = createHash('sha256');

const hash = (id: number, expiry: number): string => {
    h.update(id.toString());
    h.update(expiry.toString());
    return h.digest('base64');
}

const makeAuthToken = (mode: ClientType, id: number): AuthToken => {
    const validUntil = Date.now() + 3 * 3600 * 1000;
    return { payload: hash(id, validUntil), validUntil, id, type: mode };
}

async function auth(mode: ClientType, id: number, pass: string): Promise<AuthToken> {
    /*yes, passcodes are stored in plaintext and there is no hashing or salting
    this use case does not require a rigorous authentication process*/

    // development environment
    if (process.env.NODE_ENV !== 'production') {
        if (pass !== '0000') throw `wrong password for user mode ${mode} id ${id}`;
        return makeAuthToken(mode, id);
    }

    // production environment
    let fileHandle: FileHandle;

    try {
        fileHandle = await open(AUTH_DETAILS, 'r');
        const data = JSON.parse(await fileHandle.readFile({ encoding: 'utf-8' }));

        const entry = data[mode].find((e: AuthEntry) => e.id === id);
        if (entry === undefined) throw `unknown user id ${id} for mode ${mode}`;
        if (entry.pass !== pass) throw `wrong password for user mode ${mode} id ${id}`;
        return makeAuthToken(mode, id);
    } finally {
        await fileHandle?.close()
    }
}


export default auth;
