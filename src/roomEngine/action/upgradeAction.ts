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
        if (!room.storage) {
            //如果有upgrader同时upgrader的数量大于等于闲置且有能量的carrier数量-1，跳过
            const upgraderCount = room.creeps('upgrader', false).length
            if (upgraderCount > 0 && upgraderCount >= room.idleCreeps('carrier').filter(c => c.store[RESOURCE_ENERGY] > 0).length - 1) return
        }


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
