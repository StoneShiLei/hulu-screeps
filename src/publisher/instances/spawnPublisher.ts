export class SpawnPublisher implements Publisher {
    publish(room: Room): void {
        if (room.energyAvailable < room.energyCapacityAvailable) {

            const fillTargets = [
                ..._.filter(room.spawns, s => s.store.energy < s.store.getCapacity(RESOURCE_ENERGY)),
                ..._.filter(room.extensions, s => s.store.energy < s.store.getCapacity(RESOURCE_ENERGY))
            ].map(o => { return { target: [o], type: 'fillSpawn', priority: 90 } })
            room.messageQueue.push(...fillTargets)
        }
    }

}
