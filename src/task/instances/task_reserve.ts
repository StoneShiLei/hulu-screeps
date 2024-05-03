import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type ReserveTargetType = StructureController

@TaskRegistration<ReserveTargetType>()
export class TaskReserve extends Task<ReserveTargetType> {

    static taskName = 'reserve'

    static createInstance(target: ReserveTargetType, options?: TaskOption) {
        return new TaskReserve(target, options)
    }

    constructor(target: ReserveTargetType, option = {} as TaskOption) {
        super(TaskReserve.taskName, target, option)
    }

    isValidTask(): boolean {
        return this.creep.getActiveBodyparts(CLAIM) > 0
    }
    isValidTarget(): boolean {
        return !!this.target && !this.target.owner && (!this.target.reservation || this.target.reservation.ticksToEnd < 4999)
    }
    work(): number {
        if (!!this.target) {
            return this.creep.reserveController(this.target)
        }
        else {
            return this.finish()
        }
    }

}
