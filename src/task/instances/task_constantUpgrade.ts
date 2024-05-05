import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";
import { UpgradeTargetType } from "./task_upgrade";
import { TaskHelper } from "task/TaskHelper";

@TaskRegistration<UpgradeTargetType>()
export class TaskConstantUpgrade extends Task<UpgradeTargetType> {

    static taskName = 'constantUpgrade'

    static createInstance(target: UpgradeTargetType, options?: TaskOption) {
        return new TaskConstantUpgrade(target, options)
    }

    constructor(target: UpgradeTargetType, options = {} as TaskOption) {
        super(TaskConstantUpgrade.taskName, target, options);

        this.setting.targetRange = 3
        this.setting.workOffRoad = true
    }

    isValidTask(): boolean {
        return true
    }
    isValidTarget(): boolean {
        return true
    }

    work(): number {
        if (!this.target) return OK
        debugger
        const container = this.target.container
        if (!container) return OK

        //修理container
        if ((this.creep.ticksToLive || 0) % 7 == 0 && this.creep.store[RESOURCE_ENERGY] > 0) {
            if (container && container.hits / container.hitsMax < 0.9) {
                return this.creep.repair(container)
            }
        }

        //有能量就升级
        if (this.creep.store[RESOURCE_ENERGY] > 0) {
            return this.creep.upgradeController(this.target)
        }

        //没有能量且container也没能量就跳过
        if (container.store[RESOURCE_ENERGY] == 0) return OK

        //尝试拿取能量
        const res = this.creep.withdraw(container, RESOURCE_ENERGY)
        if (res == ERR_NOT_IN_RANGE) return this.creep.moveTo(container)

        // //附近有能量尝试捡起来
        // if ((this.creep.ticksToLive || 0) % 6 <= 1) {
        //     const droped = this.creep.pos.lookFor(LOOK_ENERGY).shift()
        //     if (droped) {
        //         this.creep.pickup(droped)
        //     }
        //     const tomb = this.creep.pos.lookFor(LOOK_TOMBSTONES).shift()
        //     if (tomb) {
        //         this.creep.withdraw(tomb, RESOURCE_ENERGY)
        //     }
        // }

        return OK
    }
}

