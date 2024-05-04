import { HarvestTargetType } from "task/instances/task_harvest";
import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { WorkerBodyConfig } from "role/bodyConfig/worker";

export class SourceAction extends Action {
    // static harvest(taskPackage: TaskPackage<HarvestTargetType>) {
    //     taskPackage.targets.forEach(targetPackage => {
    //         const task = TaskHelper.harvest(targetPackage.target)
    //         targetPackage.creeps.forEach(creep => creep.task = task)
    //     })

    //     if (taskPackage.needSpawn) {
    //         taskPackage.room.trySpawn('worker', WorkerBodyConfig.lowWorker)
    //     }
    // }

    static harvest(targets: HarvestTargetType[], role: RoleType, room: Room) {
        return function () {
            // const creeps = room.creeps(role, false).filter(c => c.isIdle)

            // targets.forEach(target => {
            //     creeps.forEach(creep => {
            //         creep.task = TaskHelper.harvest(target)
            //     })
            // })

            //     if (taskPackage.needSpawn) {
            //         taskPackage.room.trySpawn('worker', WorkerBodyConfig.lowWorker)
            //     }
        }
    }
}
