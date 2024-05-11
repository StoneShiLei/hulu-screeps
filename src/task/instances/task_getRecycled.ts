import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type GetRecycledTargetType = StructureSpawn

@TaskRegistration<GetRecycledTargetType>()
export class TaskGetRecycled extends Task<GetRecycledTargetType> {

    static taskName = 'getrecycled'

    static createInstance(target: GetRecycledTargetType, options?: TaskOption) {
        return new TaskGetRecycled(target, options)
    }

    constructor(target: GetRecycledTargetType, option = {} as TaskOption) {
        super(TaskGetRecycled.taskName, target, option)
    }

    isValidTask(): boolean {
        return true
    }
    isValidTarget(): boolean {
        return !!this.target && this.target.my
    }
    work(): number {
        if (!!this.target) {
            return this.target.recycleCreep(this.creep);
        }
        else {
            return this.finish()
        }
    }

}
