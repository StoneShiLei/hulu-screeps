export class SourcePublisher implements Publisher {
    publish(room: Room): void {
        _.each(room.sources, source => {
            // if room.level   room.enery....
            room.messageQueue = room.messageQueue || []
            room.messageQueue.push({ target: source, type: 'harvest1', priority: 10 })
        })
    }

}
