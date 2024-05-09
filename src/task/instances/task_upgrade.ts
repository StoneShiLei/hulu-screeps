import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type UpgradeTargetType = StructureController

@TaskRegistration<UpgradeTargetType>()
export class TaskUpgrade extends Task<UpgradeTargetType> {

    static taskName = 'upgrade'

    static createInstance(target: UpgradeTargetType, options?: TaskOption) {
        return new TaskUpgrade(target, options)
    }

    constructor(target: UpgradeTargetType, option = {} as TaskOption) {
        super(TaskUpgrade.taskName, target, option)
        this.setting.targetRange = 3
        this.setting.workOffRoad = true
    }

    isValidTask(): boolean {
        return this.creep.store.energy > 0
    }
    isValidTarget(): boolean {
        return !!this.target && this.target.my
    }
    work(): number {
        if (!!this.target && this.target.my) {
            const res = this.creep.upgradeController(this.target)
            return res
        }
        else {
            return this.finish()
        }
    }

}
