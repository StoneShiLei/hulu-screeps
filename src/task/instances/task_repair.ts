import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type RepairTargetType = Structure

@TaskRegistration<RepairTargetType>()
export class TaskRepair extends Task<RepairTargetType> {

    static taskName = 'repair'

    static createInstance(target: RepairTargetType, options?: TaskOption) {
        return new TaskRepair(target, options)
    }

    constructor(target: RepairTargetType, option = {} as TaskOption) {
        super(TaskRepair.taskName, target, option)
        this.setting.targetRange = 3
    }

    isValidTask(): boolean {
        return this.creep.store.energy > 0
    }
    isValidTarget(): boolean {
        return !!this.target && this.target.hits < this.target.hitsMax
    }
    work(): number {
        if (!!this.target) {
            const res = this.creep.repair(this.target)
            if (this.target.structureType == STRUCTURE_ROAD) {
                //防止空转1tick
                let newHits = this.target.hits + this.creep.getActiveBodyparts(WORK) * REPAIR_POWER
                if (newHits > this.target.hitsMax) this.finish()
            }
            return res
        }
        else {
            return this.finish()
        }
    }

}
