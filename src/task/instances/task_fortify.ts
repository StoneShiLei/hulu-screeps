import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type FortifyTargetType = StructureWall | StructureRampart

@TaskRegistration<FortifyTargetType>()
export class TaskFortify extends Task<FortifyTargetType> {

    static taskName = 'fortify'

    static createInstance(target: FortifyTargetType, options?: TaskOption) {
        return new TaskFortify(target, options)
    }

    constructor(target: FortifyTargetType, option = {} as TaskOption) {
        super(TaskFortify.taskName, target, option)
        this.setting.targetRange = 3
        this.setting.workOffRoad = true
    }

    isValidTask(): boolean {
        return this.creep.store.energy > 0
    }
    isValidTarget(): boolean {
        return !!this.target && this.target.hits < this.target.hitsMax
    }
    work(): number {
        if (!!this.target) {
            return this.creep.repair(this.target)
        }
        else {
            return this.finish()
        }
    }

}
