

export class ControllerPublisher implements Publisher {
    publish(room: Room): void {
        if (room.my && room.controller) {
            if (room.level < 8) {
                room.messageQueue.push({ target: [room.controller], type: 'upgrade', priority: 1, canRepeat: true })
            }
            else {

            }
        }
    }

}
