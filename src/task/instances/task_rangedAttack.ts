import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type RangedAttackTargetType = AnyCreep | Structure

@TaskRegistration<RangedAttackTargetType>()
export class TaskRangedAttack extends Task<RangedAttackTargetType> {

    static taskName = 'rangedattack'

    static createInstance(target: RangedAttackTargetType, options?: TaskOption) {
        return new TaskRangedAttack(target, options)
    }

    constructor(target: RangedAttackTargetType, option = {} as TaskOption) {
        super(TaskRangedAttack.taskName, target, option)

        this.setting.targetRange = 3
    }

    isValidTask(): boolean {
        return this.creep.getActiveBodyparts(RANGED_ATTACK) > 0
    }
    isValidTarget(): boolean {
        return !!this.target && this.target.hits > 0
    }
    work(): number {
        if (!!this.target) {
            return this.creep.rangedAttack(this.target)
        }
        else {
            return this.finish()
        }
    }

}
