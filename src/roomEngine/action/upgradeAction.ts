import { UpgradeTargetType } from "task/instances/task_upgrade";
import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";

export class UpgradeAction extends Action {

    static upgrade(targets: UpgradeTargetType[], role: RoleType, room: Room) {
        return function () {
            const creeps = room.creeps(role, false).filter(c => c.isIdle)

            creeps.forEach(creep => {
                const target = targets.shift()
                if (!target) return
                const task = TaskHelper.upgrade(target)
                const tasks = Action.genTaskList(creep, task)
                creep.task = TaskHelper.chain(tasks)
            })
        }
    }
}
