import { Task } from "./task";

export type UpgradeTargetType = StructureController

export class TaskUpgrade extends Task<UpgradeTargetType> {

    static taskName: string = 'upgrade'

    constructor(target: UpgradeTargetType, option = {} as TaskOption) {
        super(TaskUpgrade.taskName, target, option)
        this.setting.targetRange = 3
    }

    isValidTask(): boolean {
        return this.creep.store.energy > 0
    }
    isValidTarget(): boolean {
        return !!this.target && this.target.my
    }
    work(): number {
        if (!!this.target && this.target.my) {
            return this.creep.upgradeController(this.target)
        }
        else {
            return this.finish()
        }
    }

}
