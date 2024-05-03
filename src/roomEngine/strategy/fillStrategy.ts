import { Strategy } from "./strategy";
import { TaskHelper } from "task/TaskHelper";
import { TransferTargetType } from "task/instances/task_transfer";

export class FillStrategy extends Strategy {
    static fillSpawn(taskPackage: TaskPackage<TransferTargetType>) {
        const targets = [...taskPackage.room.spawns, ...taskPackage.room.extensions]
            .filter(s => s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY))

        if (!targets.length) return

        taskPackage.targets[0].creeps.forEach(creep => {
            const target = creep.pos.findClosestByPath(targets)
            if (!target) return

            creep.task = TaskHelper.transfer(target)
        })
    }

    static fillTower(taskPackage: TaskPackage<TransferTargetType>) {
        taskPackage.targets.forEach(targetPackage => {
            const task = TaskHelper.transfer(targetPackage.target)
            targetPackage.creeps.forEach(creep => creep.task = task)
        })
    }
}
