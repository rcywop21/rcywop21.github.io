import { AuthToken } from './auth';

const connections: Record<string, AuthToken> = {};

export function registerToken(token: AuthToken): boolean {
    if (token.validUntil <= Date.now()) return false;
    connections[token.payload] = token;
}

export function validateToken(token: AuthToken): boolean {
    const stored = connections[token.payload];
    return stored?.id === token.id && stored.validUntil > Date.now();
}

export function deregisterToken(token: AuthToken): void {
    delete connections[token.id];
}

export function cleanup(): void {
    Object.entries(connections).forEach(([key, value]) => {
        if (value.validUntil <= Date.now()) {
            delete connections[key];
        }
    });
}
