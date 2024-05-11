import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type WithdrawAllTargetType =
    StructureStorage |
    StructureTerminal |
    StructureContainer |
    Tombstone | Ruin;

@TaskRegistration<WithdrawAllTargetType>()
export class TaskWithdrawAll extends Task<WithdrawAllTargetType> {

    static taskName = 'withdrawall'

    static createInstance(target: WithdrawAllTargetType, options?: TaskOption) {
        return new TaskWithdrawAll(target, options)
    }

    constructor(target: WithdrawAllTargetType, option = {} as TaskOption) {
        super(TaskWithdrawAll.taskName, target, option)
    }

    isValidTask(): boolean {
        return this.creep.store.getFreeCapacity() > 0
    }
    isValidTarget(): boolean {
        if (!this.target) return false

        return this.target.store.getUsedCapacity() > 0
    }
    work(): number {
        if (!this.target) return OK

        for (let resourceType in this.target.store) {
            let amountInStore = this.target.store[resourceType as ResourceConstant] || 0;
            if (amountInStore > 0) {
                return this.creep.withdraw(this.target, resourceType as ResourceConstant);
            }
        }
        return ERR_NOT_ENOUGH_RESOURCES;
    }



}
