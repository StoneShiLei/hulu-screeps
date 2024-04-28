const pickupMap: {
    [roomName: string]: Message[]
} = {}

export class PickupPublisher implements Publisher {

    publish(room: Room): void {
        pickupMap[room.name] = pickupMap[room.name] || []
        if (Game.time % 9 == 0) {
            const resources = room.find(FIND_DROPPED_RESOURCES).filter(x => x.amount > 100)
            const messages1 = resources
                .map(r => {
                    return { target: [r as TargetType], type: 'pickup', priority: 200 }
                })

            const tombstones = room.find(FIND_TOMBSTONES).filter(x => x.store.energy > 100)
            const messages2 = tombstones
                .map(r => {
                    return { target: [r as TargetType], type: 'pickup', priority: 200 }
                })

            const ruins = room.find(FIND_RUINS).filter(x => x.store.energy > 100)
            const messages3 = ruins
                .map(r => {
                    return { target: [r as TargetType], type: 'pickup', priority: 200 }
                })
            pickupMap[room.name] = messages1.concat(messages2).concat(messages3)
        }
        debugger
        const pickMsg = pickupMap[room.name].filter(r => {
            if (r.target[0] instanceof Resource) {
                return r.target[0].amount > 0
            } else if (r.target[0] instanceof Ruin) {
                return r.target[0].store.energy > 0
            } else if (r.target[0] instanceof Tombstone) {
                return r.target[0].store.energy > 0
            } else {
                return false
            }
        })
        if (pickMsg.length) room.messageQueue.push(...pickMsg)
    }

}
