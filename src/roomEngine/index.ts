import { initScheduler } from "./scheduler"


export class RoomEngine {
    static run() {
        _.values<Room>(Game.rooms).forEach(room => {

            if (room.hashTime % 3 != 0) return
            if (!room.my) return

            if (room.hashTime % 31) room.update()


            const schedulers = initScheduler(room, room.creeps().filter(c => c.isIdle))
            const taskPackages = schedulers
                .map(s => s.generateTaskPackage())
                .filter((t): t is TaskPackage<TargetType> => t !== undefined);
            taskPackages.forEach(t => t.strategy(t))
        })
    }
}
