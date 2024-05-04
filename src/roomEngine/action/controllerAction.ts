import { UpgradeTargetType } from "task/instances/task_upgrade";
import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";

export class ControllerAction extends Action {
    static upgrade(taskPackage: TaskPackage<UpgradeTargetType>) {
        taskPackage.targets.forEach(targetPackage => {
            const task = TaskHelper.upgrade(targetPackage.target)
            targetPackage.creeps.forEach(creep => creep.task = task)
        })
    }
}
