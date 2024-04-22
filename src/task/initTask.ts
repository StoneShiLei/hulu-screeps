import { GlobalHelper } from "utils/GlobalHelper"
import { Task } from "./instances/task"
import { HarvestTargetType, TaskHarvest } from "./instances/task_harvest"
import { TaskInvalid } from "./instances/task_invalid"


export function initTask(protoTask:ProtoTask):Task{
    let taskName = protoTask.name
    let target = GlobalHelper.deref(protoTask._target.ref)
    let task:Task

    switch(taskName){
        case TaskHarvest.taskName:
            task = new TaskHarvest(target as HarvestTargetType)
            break;
        default:
            console.log(`Invalid task name: ${taskName}! task.creep: ${protoTask._creep.name}. Deleting from memory!`);
            task = new TaskInvalid(target as any);
            break;
    }

    task.proto = protoTask
    return  task
}
