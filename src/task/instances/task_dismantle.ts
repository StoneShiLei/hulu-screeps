import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type DismantleTargetType = Structure

@TaskRegistration<DismantleTargetType>()
export class TaskDismantle extends Task<DismantleTargetType> {

    static taskName = 'dismantle'

    static createInstance(target: DismantleTargetType, options?: TaskOption) {
        return new TaskDismantle(target, options)
    }

    constructor(target: DismantleTargetType, option = {} as TaskOption) {
        super(TaskDismantle.taskName, target, option)
        this.setting.targetRange = 3
    }

    isValidTask(): boolean {
        return this.creep.getActiveBodyparts(WORK) > 0
    }
    isValidTarget(): boolean {
        return !!this.target && this.target.hits > 0
    }
    work(): number {
        if (!!this.target) {
            return this.creep.dismantle(this.target)
        }
        else {
            return this.finish()
        }
    }

}
