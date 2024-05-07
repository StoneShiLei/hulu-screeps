import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type MeleeAttackTargetType = AnyCreep | Structure

@TaskRegistration<MeleeAttackTargetType>()
export class TaskMeleeAttack extends Task<MeleeAttackTargetType> {

    static taskName = 'meleeattack'

    static createInstance(target: MeleeAttackTargetType, options?: TaskOption) {
        return new TaskMeleeAttack(target, options)
    }

    constructor(target: MeleeAttackTargetType, option = {} as TaskOption) {
        super(TaskMeleeAttack.taskName, target, option)

        this.setting.targetRange = 1
        this.option.moveOptions = {
            bypassHostileCreeps: false
        }
    }

    isValidTask(): boolean {
        return this.creep.getActiveBodyparts(ATTACK) > 0
    }
    isValidTarget(): boolean {
        return !!this.target && this.target.hits > 0
    }
    work(): number {
        if (!!this.target) {
            return this.creep.attack(this.target)
        }
        else {
            return this.finish()
        }
    }

}
