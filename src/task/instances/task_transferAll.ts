import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type TransferAllTargetType = StructureStorage | StructureTerminal | StructureContainer;

@TaskRegistration<TransferAllTargetType>()
export class TaskTransferAll extends Task<TransferAllTargetType> {

    static taskName = 'transferall'

    static createInstance(target: TransferAllTargetType, options?: TaskOption) {
        return new TaskTransferAll(target, options)
    }

    constructor(target: TransferAllTargetType, option = {} as TaskOption) {
        super(TaskTransferAll.taskName, target, option)

        this.data.skipEnergy = option.skipEnergy
    }

    isValidTask(): boolean {
        for (let resourceType in this.creep.store) {
            if (this.data.skipEnergy && resourceType == RESOURCE_ENERGY) {
                continue;
            }
            let amountInCarry = this.creep.store[resourceType as ResourceConstant] || 0;
            if (amountInCarry > 0) {
                return true;
            }
        }
        return false;
    }
    isValidTarget(): boolean {
        if (!this.target) return false

        return this.target.store.getFreeCapacity() > 0
    }
    work(): number {
        if (!this.target) return OK

        for (let resourceType in this.creep.store) {
            if (this.data.skipEnergy && resourceType == RESOURCE_ENERGY) {
                continue;
            }
            let amountInCarry = this.creep.store[resourceType as ResourceConstant] || 0;
            if (amountInCarry > 0) {
                return this.creep.transfer(this.target, resourceType as ResourceConstant);
            }
        }
        return ERR_NOT_ENOUGH_RESOURCES;
    }



}
