import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { HarvesterBodyConfig } from "role/bodyConfig/harvester";
import { SourceHarvestTargetType } from "task/instances/task_sourceHarvest";

export class SourceAction extends Action {

    static constantHarvest(targets: SourceHarvestTargetType[], role: RoleType, room: Room) {
        return function () {

            targets.forEach(source => {

                const tasks: ITask[] = [TaskHelper.sourceHarvest(source)]
                if (source.container) {
                    tasks.unshift(TaskHelper.goto(source.container, { targetRange: 0 }))
                }

                room.spawnQueue.push({
                    role: role,
                    bodyFunc: HarvesterBodyConfig.sourceHarvester,
                    task: TaskHelper.chain(tasks)
                })
                return

            })


        }
    }
}
