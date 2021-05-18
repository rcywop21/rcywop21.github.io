import { FileHandle, open } from 'fs/promises';

export type ClientType = 'player' | 'mentor' | 'admin';

export const asValidClientType = (x: string): ClientType | null => {
    switch (x) {
        case 'player':
            return 'player';
        case 'mentor':
            return 'mentor';
        case 'admin':
            return 'admin';
        default:
            return null;
    }
};

const AUTH_DETAILS = process.env.AUTH_DETAILS;

interface AuthEntry {
    id: number;
    pass: string;
}

async function auth(
    mode: ClientType,
    id: number,
    pass: string
): Promise<true> {
    /*yes, passcodes are stored in plaintext and there is no hashing or salting
    this use case does not require a rigorous authentication process*/

    // development environment
    if (process.env.NODE_ENV !== 'production') {
        if (id < 0 || id > 9) throw `Group name should be a number between 0 to 9`;
        if (pass !== '0000')
            throw `Incorrect Password`;
        return true;
    }

    // production environment
    let fileHandle: FileHandle;

    try {
        fileHandle = await open(AUTH_DETAILS, 'r');
        const data = JSON.parse(
            await fileHandle.readFile({ encoding: 'utf-8' })
        );

        const entry = data[mode].find((e: AuthEntry) => e.id === id);
        if (entry === undefined) throw `Group name should be a number between 0 to 9`;
        if (entry.pass !== pass)
            throw `Incorrect Password`;
        return true;
    } finally {
        await fileHandle?.close();
    }
}

export default auth;
