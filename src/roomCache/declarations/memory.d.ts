type RoomCacheType = {
    [objKey: string]: Set<string> | string
}

type CacheType = {
    [roomName: string]: RoomCacheType
}

interface Memory {
    cache: CacheType
}


