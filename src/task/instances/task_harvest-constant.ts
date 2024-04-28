import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "./task";

export type HarvestTargetType = Source | Mineral

@TaskRegistration<HarvestTargetType>()
export class TaskHarvestConstant extends Task<HarvestTargetType> {

    static taskName = 'harvest-constant'

    static createInstance(target: HarvestTargetType, options?: TaskOption) {
        return new TaskHarvestConstant(target, options)
    }

    constructor(target: HarvestTargetType, options = {} as TaskOption) {
        super(TaskHarvestConstant.taskName, target, options);

    }

    isValidTask(): boolean {
        return true
    }
    isValidTarget(): boolean {
        return !!this.target
    }

    work(): number {
        if (!this.target) {
            return this.finish()
        }

        if ((this.creep.ticksToLive || 0) % 4 == 0) {
            const droped = this.creep.pos.lookFor(LOOK_ENERGY).shift()
            if (droped) this.creep.pickup(droped)
            const tomb = this.creep.pos.lookFor(LOOK_TOMBSTONES).shift()
            if (tomb) this.creep.withdraw(tomb, RESOURCE_ENERGY)
        }

        if (this.isSource(this.target)) {
            return this.target.energy > 0 ? this.creep.harvest(this.target) : OK
        }
        else {
            return this.target.mineralAmount - 1 > 0 ? this.creep.harvest(this.target) : OK;
        }
    }

    private isSource(obj: Source | Mineral): obj is Source {
        return (obj as Source).energy != undefined;
    }

}

