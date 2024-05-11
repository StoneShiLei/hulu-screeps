import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type GoToTargetType = RoomObject | { ref: string, pos: RoomPosition }

@TaskRegistration<GoToTargetType>()
export class TaskGoto extends Task<GoToTargetType> {

    static taskName = 'goto'

    static createInstance(target: GoToTargetType, options?: TaskOption) {
        return new TaskGoto(target, options)
    }

    constructor(target: GoToTargetType, option = {} as TaskOption) {
        super(TaskGoto.taskName, target, option)

        this.setting.targetRange = option.targetRange === undefined ? 1 : option.targetRange
    }

    isValidTask(): boolean {
        return !this.creep.pos.inRangeTo(this.targetPos, this.setting.targetRange)
    }
    isValidTarget(): boolean {
        return true
    }
    work(): number {
        return OK
    }



}
