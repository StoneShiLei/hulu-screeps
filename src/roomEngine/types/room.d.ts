interface Room {
    eventQueue: Event[]
    spawnQueue: SpawnRequest[]
}



interface Event {
    action: ActionType
}

interface SpawnRequest {
    role: RoleType
    bodyFunc: BodyConfigFunc
    task?: ITask
    spawnOpt?: SpawnOptions
    targetRoomName?: string
}
