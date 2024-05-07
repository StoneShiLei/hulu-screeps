import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { HarvesterBodyConfig } from "role/bodyConfig/harvester";
import { SourceConstantHarvestTargetType } from "task/instances/task_sourceConstantHarvest";

export class SourceAction extends Action {

    static constantHarvest(targets: SourceConstantHarvestTargetType[], role: RoleType, room: Room) {
        return function () {

            targets.forEach(source => {

                const tasks: ITask[] = [TaskHelper.sourceConstantHarvest(source)]
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
