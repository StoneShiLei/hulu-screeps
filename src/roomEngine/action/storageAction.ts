import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { TransferAllTargetType } from "task/instances/task_transferAll";
import { WithdrawTargetType } from "task/instances/task_withdraw";

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

    static tranCenterLink(targets: WithdrawTargetType[], role: RoleType, room: Room) {
        return function () {
            const target = targets.shift()
            if (!target) return

            const creep = room.idleCreeps(role).filter(c => c.isEmptyStore).shift()
            if (!creep) return
            if (room.storage) {
                creep.task = TaskHelper.chain([TaskHelper.withdraw(target), TaskHelper.transfer(room.storage)])
            }
            else {
                creep.task = TaskHelper.withdraw(target)
            }

        }
    }
}
