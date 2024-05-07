import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { TransferTargetType } from "task/instances/task_transfer";

export class StorageAction extends Action {

    static fillAllResourceToStorage(targets: TransferTargetType[], role: RoleType, room: Room, options?: ActionOptions) {
        return function () {
            const target = targets.shift()
            if (!target) return

            const creeps = room.idleCreeps(role).filter(c => !c.isEmptyStore)
            creeps.forEach(creep => {
                const task = TaskHelper.transfer(target, options)
                creep.task = task
            })

        }
    }
}
