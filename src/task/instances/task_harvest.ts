import { type } from "os";
import { Task } from "./task";

export type HarvestTargetType = Source | Mineral

export class TaskHarvest extends Task {

    static taskName = 'harvest'

    constructor(target: HarvestTargetType, options = {} as TaskOption) {
		super(TaskHarvest.taskName, target, options);

	}

    isValidTask(): boolean {
        return this.creep.store.getUsedCapacity() < this.creep.store.getCapacity();
    }
    isValidTarget(): boolean {

        var t = this.target as HarvestTargetType

        if(this.isSource(t)){
            return t.energy > 0;
        }
        else{
            return t.mineralAmount > 0;
        }
    }

    work(): number {
        return this.creep.harvest(this.target as HarvestTargetType)
    }

    private isSource(obj: Source | Mineral): obj is Source {
        return (obj as Source).energy != undefined;
    }

}

