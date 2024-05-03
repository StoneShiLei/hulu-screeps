import { ErrorCatcher } from "utils/ErrorCatcher"
import { initScheduler } from "./scheduler"
import { BusinessTower } from "structure/instances/business_tower"


export class RoomEngine {
    static run() {
        _.values<Room>(Game.rooms).forEach(room => {

            ErrorCatcher.catch(() => BusinessTower.run(room))



            if (room.hashTime % 3 != 0 || !room.my) return
            if (room.hashTime % 31) room.update()


            const schedulers = initScheduler(room, room.creeps().filter(c => c.isIdle))
            const taskPackages = schedulers
                .map(s => s.generateTaskPackage())
                .filter((t): t is TaskPackage<TargetType> => t !== undefined);
            taskPackages.forEach(t => t.strategy(t))
        })
    }
}
