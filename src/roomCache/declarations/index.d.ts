type RoomCacheType = {
    [objKey: string]: Set<string>
}

type CacheType = {
    [roomName: string]: {
        data: RoomCacheType
        time: LastFetchType
    }
}

type LastFetchType = {
    [type: string]: {
        time: number
        count: number
    }
}
