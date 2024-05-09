import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { TransferAllTargetType } from "task/instances/task_transferAll";

export class StorageAction extends Action {

    static fillAllResourceToStorage(targets: TransferAllTargetType[], role: RoleType, room: Room) {
        return function () {
            const target = targets.shift()
            if (!target) return

            const creeps = room.idleCreeps(role).filter(c => !c.isEmptyStore)
            creeps.forEach(creep => {
                const task = TaskHelper.transferAll(target)
                creep.task = task
            })

        }
    }
}
