import { UpgradeTargetType } from "task/instances/task_upgrade";
import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";

export class UpgradeAction extends Action {

    static upgrade(targets: UpgradeTargetType[], role: RoleType, room: Room) {
        return function () {
            const creeps = room.idleCreeps(role, false)

            creeps.forEach(creep => {
                const target = targets.shift()
                if (!target) return
                const task = TaskHelper.upgrade(target)
                const tasks = Action.genTaskList(creep, RESOURCE_ENERGY, task)
                creep.task = TaskHelper.chain(tasks)
            })
        }
    }
}
