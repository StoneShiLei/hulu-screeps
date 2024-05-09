import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";
import { UpgradeTargetType } from "./task_upgrade";
import { TaskWithdraw } from "./task_withdraw";



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

        //有能量就升级
        if (this.creep.store[RESOURCE_ENERGY] > 0) return this.creep.upgradeController(this.target)

        const container = this.target.container
        if (!container) return OK

        const link = this.target.link

        //如果container空闲空间 > creep的容量*2，认为container是未满装填
        const containerIsNotFull = container && container.store.getFreeCapacity(RESOURCE_ENERGY) > this.creep.store.getCapacity() * 2
        //如果creep的能量 <= creep的work部件*(2000 || 1)  则认为应该补充能量
        if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) <= this.creep.getActiveBodyparts(WORK) * (containerIsNotFull ? 2000 : 1)) {
            let withdrawLinkRes: ScreepsReturnCode = ERR_FULL
            //如果link的当前可用能量大于0，则取用link的能量  （计算其他以此为目标的影响）
            if (link && (link.getCurrentStoreResource(RESOURCE_ENERGY) || 0) > 0) {
                withdrawLinkRes = this.creep.withdraw(link, RESOURCE_ENERGY)
                if (withdrawLinkRes == ERR_NOT_IN_RANGE) this.creep.moveTo(link)
            }

            //如果当前tick取用过link，则将富余1tick升级所需能量之外的能量转入到container中
            if (withdrawLinkRes == OK && containerIsNotFull) {
                const amount = this.creep.store.getCapacity() - this.creep.getActiveBodyparts(WORK) * 2
                const transferContainerRes = this.creep.transfer(container, RESOURCE_ENERGY, amount)
                if (transferContainerRes == ERR_NOT_IN_RANGE) this.creep.moveTo(container)
            }

            //如果没从link拿过能量 且 没有link或能量不足的时候，则取用container
            if (withdrawLinkRes !== OK && (!link || this.creep.store.getUsedCapacity(RESOURCE_ENERGY) < this.creep.getActiveBodyparts(WORK) * 2)) {
                const withdrawContainerRes = this.creep.withdraw(container, RESOURCE_ENERGY)
                if (withdrawContainerRes == ERR_NOT_IN_RANGE) this.creep.moveTo(container)
            }
        }

        //修理container 和 link
        if ((this.creep.ticksToLive || 0) % 7 == 0 && this.creep.store[RESOURCE_ENERGY] > 0) {
            if (container && container.hits / container.hitsMax < 0.9) {
                this.creep.repair(container)
            }
            if (link && link.hits / link.hitsMax < 0.9) {
                this.creep.repair(link)
            }
        }

        //防止堵路
        if ((this.creep.ticksToLive || 0) % 2 > 0) this.creep.memory.dontPullMe = false;

        return OK
    }
}

