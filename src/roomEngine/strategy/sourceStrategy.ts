import { HarvestTargetType } from "task/instances/task_harvest";
import { Strategy } from "./strategy";
import { TaskHelper } from "task/TaskHelper";
import { WorkerBodyConfig } from "role/bodyConfig/worker";

export class SourceStrategy extends Strategy {
    static harvest(taskPackage: TaskPackage<HarvestTargetType>) {
        taskPackage.targets.forEach(targetPackage => {
            const task = TaskHelper.harvest(targetPackage.target)
            targetPackage.creeps.forEach(creep => creep.task = task)
        })

        if (taskPackage.needSpawn) {
            taskPackage.room.trySpawn('worker', WorkerBodyConfig.lowWorker)
        }
    }
}
