import { PickupTargetType } from "task/instances/task_pickup";
import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { WithdrawTargetType } from "task/instances/task_withdraw";

export class DropedResourceAction extends Action {
    static takeDroped(taskPackage: TaskPackage<PickupTargetType | WithdrawTargetType>) {

        const target = taskPackage.targets[0].target
        taskPackage.targets[0].creeps.forEach(creep => {
            if ('store' in target) {
                creep.task = TaskHelper.withdraw(target)
            }
            else {
                creep.task = TaskHelper.pickup(target)
            }
        })
    }
}
