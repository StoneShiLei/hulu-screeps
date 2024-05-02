
type CacheType = {
    [roomName: string]: {
        data: RoomCacheType
        time: LastFetchType
    }
}

type RoomCacheType = {
    [objKey: string]: Set<string>
}

type LastFetchType = {
    [type: string]: {
        time: number
        count: number
    }
}
