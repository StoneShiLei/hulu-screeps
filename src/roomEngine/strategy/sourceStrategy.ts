import { HarvestTargetType } from "task/instances/task_harvest";
import { Strategy } from "./strategy";
import { TaskHelper } from "task/TaskHelper";

export class SourceStrategy extends Strategy {
    static harvest(taskPackage: TaskPackage<HarvestTargetType>) {
        taskPackage.targets.forEach(targetPackage =>
            targetPackage.creeps.forEach(creep =>
                creep.task = TaskHelper.harvest(targetPackage.target)))
    }
}
