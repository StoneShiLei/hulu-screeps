import { BuildTargetType } from "task/instances/task_build";
import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { RoomStatusEnum } from "global/protos/room"

export class BuildableAction extends Action {
    static build(targets: BuildTargetType[], role: RoleType, room: Room) {
        return function () {
            const creeps = room.idleCreeps(role)

            creeps.forEach(creep => {
                const target = creep.pos.findClosestByPath(targets, { ignoreCreeps: true })
                if (!target) return
                const task = TaskHelper.build(target)
                const tasks = Action.genTaskList(creep, undefined, task)
                creep.task = TaskHelper.chain(tasks)
            })


        }
    }
}
