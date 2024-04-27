export class SpawnPublisher implements Publisher {
    publish(room: Room): void {
        _.each(room.spawns, spawn => {
            // if room.level   room.enery....
            room.messageQueue = room.messageQueue || []
            if (room.energyAvailable < room.energyCapacityAvailable) {
                room.messageQueue.push({ target: spawn, type: 'fillSpawn', priority: 9 })
            }
        })
    }

}
