import { type } from "os";
import { Task } from "./task";

export type HarvestTargetType = Source | Mineral

export class TaskHarvest extends Task<HarvestTargetType> {

    static taskName = 'harvest'

    constructor(target: HarvestTargetType, options = {} as TaskOption) {
        super(TaskHarvest.taskName, target, options);

    }

    isValidTask(): boolean {
        return this.creep.store.getUsedCapacity() < this.creep.store.getCapacity();
    }
    isValidTarget(): boolean {

        if (!this.target) return false

        if (this.isSource(this.target)) {
            return this.target.energy > 0;
        }
        else {
            return this.target.mineralAmount - 1 > 0;
        }
    }

    work(): number {
        if (this.target) {
            return this.creep.harvest(this.target)
        }
        else {
            return this.finish()
        }
    }

    private isSource(obj: Source | Mineral): obj is Source {
        return (obj as Source).energy != undefined;
    }

}

