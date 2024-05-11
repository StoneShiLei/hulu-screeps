import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type DropTargetType = RoomObject | { ref: string, pos: RoomPosition }

@TaskRegistration<DropTargetType>()
export class TaskDrop extends Task<DropTargetType> {

    static taskName = 'drop'

    static createInstance(target: DropTargetType, options?: TaskOption) {
        return new TaskDrop(target, options)
    }

    constructor(target: DropTargetType, option = {} as TaskOption) {
        super(TaskDrop.taskName, target, option)

        this.setting.oneShot = true;
        this.setting.targetRange = 0;

        this.data.resourceType = option.resourceType || RESOURCE_ESSENCE;
        this.data.amount = option.amount;
    }

    isValidTask(): boolean {
        const amount = this.data.amount || 1;
        const inCarry = this.creep.store.getUsedCapacity(this.data.resourceType);
        return inCarry >= amount;
    }
    isValidTarget(): boolean {
        return true
    }
    work(): number {
        return this.creep.drop(this.data.resourceType || RESOURCE_ESSENCE, this.data.amount);
    }



}
