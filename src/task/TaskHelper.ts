import { HarvestTargetType, TaskHarvest } from "./instances/task_harvest";


export class TaskHelper{
    // static chain(task:ITask[],setNextPos = true):ITask | null{

    // }

    static harvest(target:HarvestTargetType,option = {} as TaskOption):TaskHarvest {
        return new TaskHarvest(target,option)
    }
}
