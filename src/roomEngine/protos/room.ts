export class RoomExtension extends Room {

    _eventQueue: Event[] | undefined
    _spawnQueue: SpawnRequest[] | undefined

    eventQueueGetter(): Event[] {
        this._eventQueue = this._eventQueue || []
        return this._eventQueue
    }

    spawnQueueGetter(): SpawnRequest[] {
        this._spawnQueue = this._spawnQueue || []
        return this._spawnQueue
    }
}
