import { BuildTargetType, TaskBuild } from "task/instances/task_build";
import { GoToTargetType, TaskGoto } from "task/instances/task_goto";
import { TaskHarvestConstant } from "task/instances/task_harvest-constant";
import { PickupTargetType, TaskPickup } from "task/instances/task_pickup";
import { HarvestTargetType, TaskHarvest } from "../instances/task_harvest";
import { TaskTransfer, TransferTargetType } from "../instances/task_transfer";
import { TaskUpgrade, UpgradeTargetType } from "../instances/task_upgrade";

/**
 * 任务帮助
 */
export class TaskHelper {

    /**
     *  构造任务链，将一系列任务构造为单个任务，互相关联
     * @param tasks 任务数组，先进后出，先进为父，后进为子
     * @param setNextPos 执行完子任务后是否向父任务移动，防止空转一tick
     * @returns 子任务
     */
    static chain(tasks: ITask[], setNextPos = true): ITask | null {
        if (!tasks.length) return null
        if (setNextPos) {
            _.each(tasks, task => task.option.moveNextTarget = true)
        }

        let task = _.last(tasks)
        tasks = _.dropRight(tasks);
        //关联父子任务
        for (let i = (tasks.length - 1); i >= 0; i--) {
            task = task.fork(tasks[i]);
        }

        return task
    }

    static harvest(target: HarvestTargetType, option?: TaskOption): TaskHarvest {
        return new TaskHarvest(target, option)
    }

    static harvestConstant(target: HarvestTargetType, option?: TaskOption): TaskHarvestConstant {
        return new TaskHarvestConstant(target, option)
    }

    static transfer(target: TransferTargetType, option?: TaskOption): TaskTransfer {
        return new TaskTransfer(target, option)
    }

    static upgrade(target: UpgradeTargetType, option?: TaskOption): TaskUpgrade {
        return new TaskUpgrade(target, option)
    }

    static build(target: BuildTargetType, option?: TaskOption): TaskBuild {
        return new TaskBuild(target, option)
    }

    static goto(target: GoToTargetType, option?: TaskOption): TaskGoto {
        return new TaskGoto(target, option)
    }

    static pickup(target: PickupTargetType, option?: TaskOption): TaskPickup {
        return new TaskPickup(target, option)
    }
}
