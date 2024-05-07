import { LOCAL_SHARD_NAME, SIM_ROOM_NAME } from "global";

export function mountBetterMove() {
    if (LOCAL_SHARD_NAME == SIM_ROOM_NAME) return
    require('betterMove')
    console.log('BetterMove is mounted')
}

