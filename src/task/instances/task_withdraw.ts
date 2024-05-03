import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type WithdrawTargetType = StoreStructure
    | StructureLab
    | StructureNuker
    | StructurePowerSpawn
    | Tombstone
    | Ruin;

@TaskRegistration<WithdrawTargetType>()
export class TaskWithdraw extends Task<WithdrawTargetType> {

    static taskName = 'withdraw'

    static createInstance(target: WithdrawTargetType, options?: TaskOption) {
        return new TaskWithdraw(target, options)
    }

    constructor(target: WithdrawTargetType, option = {} as TaskOption) {
        super(TaskWithdraw.taskName, target, option)

        this.setting.oneShot = true
        this.data.resourceType = option.resourceType || RESOURCE_ENERGY
        this.data.amount = option.amount
    }

    isValidTask(): boolean {
        const amount = this.data.amount || 1;
        const freeStore = this.creep.store.getFreeCapacity(this.data.resourceType);
        return freeStore >= amount;
    }
    isValidTarget(): boolean {
        const amount = this.data.amount || 1;
        const target = this.target;
        if (!target) return false

        let resourceTypeIsValid = true
        let capacityIsValid = (target.store.getUsedCapacity(this.data.resourceType) || 0) > amount
        if (target instanceof StructureLab) {
            resourceTypeIsValid = target.mineralType == this.data.resourceType
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
            return this.creep.withdraw(this.target, RESOURCE_ENERGY, this.data.amount)
        }
        else {
            return this.finish()
        }
    }



}
