import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type PickupTargetType = Resource

@TaskRegistration<PickupTargetType>()
export class TaskPickup extends Task<PickupTargetType> {

    static taskName = 'pickup'

    static createInstance(target: PickupTargetType, options?: TaskOption) {
        return new TaskPickup(target, options)
    }

    constructor(target: PickupTargetType, option = {} as TaskOption) {
        super(TaskPickup.taskName, target, option)
        this.setting.oneShot = true
    }

    isValidTask(): boolean {
        return this.creep.store.getUsedCapacity() < this.creep.store.getCapacity()
    }
    isValidTarget(): boolean {
        return !!this.target && this.target.amount > 0
    }
    work(): number {
        if (this.target) {
            return this.creep.pickup(this.target)
        }
        else {
            return this.finish()
        }
    }

}
