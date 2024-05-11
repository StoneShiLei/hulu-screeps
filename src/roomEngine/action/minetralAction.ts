import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { HarvesterBodyConfig } from "role/bodyConfig/harvester";
import { MineralHarvestTargetType } from "task/instances/task_mineralHarvest";

export class MineralAction extends Action {

    static constantHarvest(targets: MineralHarvestTargetType[], role: RoleType, room: Room) {
        return function () {
            if (!targets.length) return
            const mineral = targets[0]
            const container = room.extractor?.container
            if (!container) return

            const tasks: ITask[] = [TaskHelper.goto(container, { targetRange: 0 }),
            TaskHelper.mineralHarvest(mineral)]

            room.spawnQueue.push({
                role: role,
                bodyFunc: HarvesterBodyConfig.mineralHarvester,
                task: TaskHelper.chain(tasks)
            })
            return
        }
    }
}
