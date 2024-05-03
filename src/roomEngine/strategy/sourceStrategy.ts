import { HarvestTargetType } from "task/instances/task_harvest";
import { Strategy } from "./strategy";
import { TaskHelper } from "task/TaskHelper";

export class SourceStrategy extends Strategy {
    static harvest(taskPackage: TaskPackage<HarvestTargetType>) {
        taskPackage.targets.forEach(targetPackage => {
            const task = TaskHelper.harvest(targetPackage.target)
            targetPackage.creeps.forEach(creep => creep.task = task)
        })

        if (taskPackage.needSpawn) {
            taskPackage.room.spawns[0].spawnCreep([WORK, CARRY, MOVE, MOVE],
                'Worker' + Game.time,
                { memory: { roomName: taskPackage.room.name, role: 'worker', task: null } }
            )
        }
    }
}
