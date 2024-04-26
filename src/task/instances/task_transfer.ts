import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "./task";

export type TransferTargetType =
    EnergyStructure
    | StoreStructure
    | StructureLab
    | StructureNuker
    | StructurePowerSpawn
    | Creep;

@TaskRegistration<TransferTargetType>()
export class TaskTransfer extends Task<TransferTargetType> {

    static taskName = 'transfer'

    static createInstance(target: TransferTargetType, options?: TaskOption) {
        return new TaskTransfer(target, options)
    }

    constructor(target: TransferTargetType, option = {} as TaskOption) {
        super(TaskTransfer.taskName, target, option)
    }

    isValidTask(): boolean {
        let amount = 1;
        let resourcesInCarry = this.creep.store.getUsedCapacity() || 0;
        return resourcesInCarry >= amount;
    }
    isValidTarget(): boolean {
        let amount = 1;
        let target = this.target;
        if (target instanceof StructureSpawn) {
            return target.store.getUsedCapacity(RESOURCE_ENERGY)
                <= target.store.getCapacity(RESOURCE_ENERGY)
        }
        return false
    }
    work(): number {
        if (this.target) {
            return this.creep.transfer(this.target, RESOURCE_ENERGY)
        }
        else {
            return this.finish()
        }
    }



}
