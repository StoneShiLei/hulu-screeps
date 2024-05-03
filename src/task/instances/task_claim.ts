import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type ClaimTargetType = StructureController

@TaskRegistration<ClaimTargetType>()
export class TaskClaim extends Task<ClaimTargetType> {

    static taskName = 'claim'

    static createInstance(target: ClaimTargetType, options?: TaskOption) {
        return new TaskClaim(target, options)
    }

    constructor(target: ClaimTargetType, option = {} as TaskOption) {
        super(TaskClaim.taskName, target, option)
        this.setting.targetRange = 3
    }

    isValidTask(): boolean {
        return this.creep.getActiveBodyparts(CLAIM) > 0
    }
    isValidTarget(): boolean {
        return !!this.target && (!this.target.room || !this.target.owner)
    }
    work(): number {
        if (!!this.target) {
            return this.creep.claimController(this.target)
        }
        else {
            return this.finish()
        }
    }

}
