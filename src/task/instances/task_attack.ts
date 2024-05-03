import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type AttackTargetType = AnyCreep | Structure

@TaskRegistration<AttackTargetType>()
export class TaskAttack extends Task<AttackTargetType> {

    static taskName = 'attack'

    static createInstance(target: AttackTargetType, options?: TaskOption) {
        return new TaskAttack(target, options)
    }

    constructor(target: AttackTargetType, option = {} as TaskOption) {
        super(TaskAttack.taskName, target, option)

        this.setting.targetRange = 3
    }

    isValidTask(): boolean {
        return this.creep.getActiveBodyparts(ATTACK) > 0 || this.creep.getActiveBodyparts(RANGED_ATTACK) > 0
    }
    isValidTarget(): boolean {
        return !!this.target && this.target.hits > 0
    }
    work(): number {
        let result: number = OK;
        if (!this.target) return result

        // 处理近战攻击
        if (this.creep.getActiveBodyparts(ATTACK) > 0) {
            if (this.creep.pos.isNearTo(this.target)) {
                result = this.creep.attack(this.target);
            } else {
                result = this.moveToTarget(1);
            }
        }

        // 如果近战攻击成功并且Creep具备远程攻击能力，则尝试远程攻击
        if (result === OK &&
            this.creep.getActiveBodyparts(RANGED_ATTACK) > 0 &&
            this.creep.pos.inRangeTo(this.target, 3)) {
            result = this.creep.rangedAttack(this.target);
        }

        return result;
    }

}
