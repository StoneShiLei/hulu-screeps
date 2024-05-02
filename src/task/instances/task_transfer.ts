import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type TransferTargetType = StoreStructure
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

        this.setting.oneShot = true
        this.data.resourceType = option.resourceType || RESOURCE_ENERGY
        this.data.amount = option.amount
    }

    isValidTask(): boolean {
        const amount = this.data.amount || 1;
        const inCarry = this.creep.store.getUsedCapacity(this.data.resourceType);
        return inCarry >= amount;
    }
    isValidTarget(): boolean {
        const amount = this.data.amount || 1;
        const target = this.target;
        if (!target) return false

        let resourceTypeIsValid = true
        let capacityIsValid = (target.store.getFreeCapacity(this.data.resourceType) || 0) > amount
        if (target instanceof StructureLab) {
            resourceTypeIsValid = !target.mineralType || target.mineralType == this.data.resourceType
        }
        else if (target instanceof StructureNuker) {
            resourceTypeIsValid = this.data.resourceType == RESOURCE_GHODIUM
        }
        else if (target instanceof StructurePowerSpawn) {
            resourceTypeIsValid = this.data.resourceType == RESOURCE_POWER
        }
        else { }

        return resourceTypeIsValid && capacityIsValid
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
