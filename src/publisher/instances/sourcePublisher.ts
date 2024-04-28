export class SourcePublisher implements Publisher {
    publish(room: Room): void {
        _.each(room.sources, source => {

            if (source.energy == 0) return

            //根据房间等级进行不同的任务发布条件
            if (room.level < 10) {
                // const workablePosCount = source.pos.surroundPos().filter(p => p.isWalkable()).length
                // const targetedCount = source.targetedBy.length

                // if (workablePosCount - targetedCount > 0)
                //     room.messageQueue.push({ target: [source], type: 'harvest1', priority: 100 })
                const targetedCount = source.targetedBy.length
                if (targetedCount == 0)
                    room.messageQueue.push({ target: [source], type: 'harvest2', priority: 100 })
            }
            else if (room.level >= 3 && room.energyCapacityAvailable >= 800) {
                const targetedCount = source.targetedBy.length
                if (targetedCount == 0)
                    room.messageQueue.push({ target: [source], type: 'harvest2', priority: 100 })
            }
            else { }
        })
    }

}
