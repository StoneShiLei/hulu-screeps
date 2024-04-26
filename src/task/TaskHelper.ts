import { HarvestTargetType, TaskHarvest } from "./instances/task_harvest";
import { TaskTransfer, TransferTargetType } from "./instances/task_transfer";
import { TaskUpgrade, UpgradeTargetType } from "./instances/task_upgrade";

/**
 * 任务帮助
 */
export class TaskHelper {
    // static chain(task:ITask[],setNextPos = true):ITask | null{

    // }

    static harvest(target: HarvestTargetType, option = {} as TaskOption): TaskHarvest {
        return new TaskHarvest(target, option)
    }

    static transfer(target: TransferTargetType, option = {} as TaskOption): TaskTransfer {
        return new TaskTransfer(target, option)
    }

    static upgrade(target: UpgradeTargetType, option = {} as TaskOption): TaskUpgrade {
        return new TaskUpgrade(target, option)
    }
}
