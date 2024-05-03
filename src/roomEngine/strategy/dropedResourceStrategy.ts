import { PickupTargetType } from "task/instances/task_pickup";
import { Strategy } from "./strategy";
import { TaskHelper } from "task/TaskHelper";
import { WithdrawTargetType } from "task/instances/task_withdraw";

export class DropedResourceStrategy extends Strategy {
    static takeDroped(taskPackage: TaskPackage<PickupTargetType | WithdrawTargetType>) {
        const target = taskPackage.targets[0].target
        taskPackage.targets[0].creeps.forEach(creep => {
            if ('store' in target) {
                console.log(111)
                creep.task = TaskHelper.withdraw(target)
            }
            else {
                console.log(222)
                creep.task = TaskHelper.pickup(target)
            }
        })
    }
}
