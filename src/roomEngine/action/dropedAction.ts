import { Action } from "./action";
import { PickupTargetType } from "task/instances/task_pickup";
import { WithdrawTargetType } from "task/instances/task_withdraw";

export class DropedAction extends Action {
    static takeDroped(targets: (PickupTargetType | WithdrawTargetType)[], role: RoleType, room: Room) {
        return function () {
            if (!targets.length) return

            const creeps = room.idleCreeps(role).filter(c => c.isEmptyStore)
            creeps.forEach(creep => {
                const target = targets.shift()
                if (!target) return
                creep.task = Action.genTakeResourceTask(target)
            })
        }
    }
}
