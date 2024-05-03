import { UpgradeTargetType } from "task/instances/task_upgrade";
import { Strategy } from "./strategy";
import { TaskHelper } from "task/TaskHelper";

export class ControllerStrategy extends Strategy {
    static upgrade(taskPackage: TaskPackage<UpgradeTargetType>) {
        taskPackage.targets.forEach(targetPackage => {
            const task = TaskHelper.upgrade(targetPackage.target)
            targetPackage.creeps.forEach(creep => creep.task = task)
        })
    }
}
