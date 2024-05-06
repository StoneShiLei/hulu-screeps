import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type HealTargetType = AnyCreep

@TaskRegistration<HealTargetType>()
export class TaskHeal extends Task<HealTargetType> {

    static taskName = 'heal'

    static createInstance(target: HealTargetType, options?: TaskOption) {
        return new TaskHeal(target, options)
    }

    constructor(target: HealTargetType, option = {} as TaskOption) {
        super(TaskHeal.taskName, target, option)

        this.setting.targetRange = 3
    }

    isValidTask(): boolean {
        return this.creep.getActiveBodyparts(HEAL) > 0
    }
    isValidTarget(): boolean {
        return !!this.target && this.target.hits < this.target.hitsMax && this.target.my
    }
    work(): number {
        if (!!this.target) {
            if (this.creep.pos.isNearTo(this.target)) {
                return this.creep.heal(this.target);
            } else {
                this.moveToTarget(1);
            }
            return this.creep.rangedHeal(this.target);
        }
        else {
            return this.finish()
        }
    }

}
