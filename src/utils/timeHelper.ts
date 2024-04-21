
export function now():string{
    const now = new Date();
    const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    return timeFormat(utc8Time)
}

export function gameTick():number{
    return Game.time
}

function timeFormat(time: Date) {
    const year = time.getUTCFullYear();
    const month = (time.getUTCMonth() + 1).toString().padStart(2, '0');
    const date = time.getUTCDate().toString().padStart(2, '0');
    const hours = time.getUTCHours().toString().padStart(2, '0');
    const minutes = time.getUTCMinutes().toString().padStart(2, '0');
    const seconds = time.getUTCSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}
