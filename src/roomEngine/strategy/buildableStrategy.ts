import { BuildTargetType } from "task/instances/task_build";
import { Strategy } from "./strategy";
import { TaskHelper } from "task/TaskHelper";

export class BuildableStrategy extends Strategy {
    static build(taskPackage: TaskPackage<BuildTargetType>) {
        const targets = taskPackage.room.constructionSites
        if (!targets.length) return

        taskPackage.targets[0].creeps.forEach(creep => {
            const target = creep.pos.findClosestByPath(targets, { ignoreCreeps: true })
            if (!target) return

            creep.task = TaskHelper.build(target)
        })
    }
}
