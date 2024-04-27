

export class ControllerPublisher implements Publisher {
    publish(room: Room): void {
        // _.each(room.sources, source => {
        //     // if room.level   room.enery....
        //     room.messageQueue.push({ target: source, type: 'harvest1', priority: 10 })
        // })
        // console.log(2)

        // 具体的任务发布逻辑
        // this.handle(room); // 调用下一个中间件

        // console.log(2)
        if (room.my) {
            room.messageQueue.push({ target: room.controller!, type: 'upgrade', priority: 1 })
        }
    }

}
