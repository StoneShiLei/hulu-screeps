import { Container } from "typescript-ioc"
import { GlobalHelper } from "utils/GlobalHelper"
import { Logger } from "utils/Logger"
import { Task } from "./instances/task"
import { HarvestTargetType, TaskHarvest } from "./instances/task_harvest"
import { TaskInvalid } from "./instances/task_invalid"
import { TaskTransfer, TransferTargetType } from "./instances/task_transfer"
import { TaskUpgrade, UpgradeTargetType } from "./instances/task_upgrade"

const log = Container.get(Logger)

const taskMap = {
    [TaskHarvest.taskName]: TaskHarvest,
    [TaskTransfer.taskName]: TaskTransfer,
    [TaskUpgrade.taskName]: TaskUpgrade,
};

/**
 * 将原型任务根据名称转为task
 * @param protoTask 原型任务
 * @returns 任务
 */
export function initTask(protoTask: ProtoTask): Task<TargetType> {
    let taskName = protoTask.name
    let target = GlobalHelper.deref(protoTask._target.ref)
    // let task: Task<TargetType>

    const TaskClass = taskMap[taskName];
    if (!TaskClass) {
        log.logError(`非法任务: ${taskName}! task.creep: ${protoTask._creep.name}. 从memory中删除!`);
        return new TaskInvalid(target as any);
    }

    const task = new TaskClass(target as any);

    // switch (taskName) {
    //     case TaskHarvest.taskName:
    //         task = new TaskHarvest(target as HarvestTargetType)
    //         break;
    //     case TaskTransfer.taskName:
    //         task = new TaskTransfer(target as TransferTargetType)
    //         break;
    //     case TaskUpgrade.taskName:
    //         task = new TaskUpgrade(target as UpgradeTargetType)
    //         break;
    //     default:
    //         log.logError(`非法任务: ${taskName}! task.creep: ${protoTask._creep.name}. 从memory中删除!`);
    //         task = new TaskInvalid(target as any);
    //         break;
    // }

    task.proto = protoTask

    return task
}
