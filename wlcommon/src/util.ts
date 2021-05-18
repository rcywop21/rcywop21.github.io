function padNumber(x: number, numOfDigits: number): string {
    return x.toString().padStart(numOfDigits, '0');
}

export function formatDuration(millisecs: number): string {
    let secs = Math.floor(millisecs / 1000);

    if (secs <= 60) return secs + 's';

    let mins = Math.floor(secs / 60);
    secs %= 60;
    if (mins < 60) return `${mins}min ${padNumber(secs, 2)}s`;

    const hrs = Math.floor(mins / 60);
    mins %= 60;
    return `${hrs}h ${padNumber(mins, 2)}min ${padNumber(secs, 2)}s`;
}
