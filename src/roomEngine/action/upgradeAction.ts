import { UpgradeTargetType } from "task/instances/task_upgrade";
import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { UpgraderBodyConfig } from "role/bodyConfig/upgrader";

export class UpgradeAction extends Action {

    static workerUpgrade(targets: UpgradeTargetType[], role: RoleType, room: Room) {
        return function () {
            const creeps = room.idleCreeps(role, false)

            creeps.forEach(creep => {
                const target = targets.shift()
                if (!target) return
                const task = TaskHelper.upgrade(target)
                const tasks = Action.genTaskList(creep, undefined, task)
                creep.task = TaskHelper.chain(tasks)
            })
        }
    }

    static upgraderUpgrade(targets: UpgradeTargetType[], role: RoleType, room: Room) {
        return function () {
            if (!targets.length) return
            const controller = targets[0]
            room.spawnQueue.push({
                role: role,
                bodyFunc: UpgraderBodyConfig.upgrader,
                task: TaskHelper.constantUpgrade(controller)
            })
        }
    }
}
