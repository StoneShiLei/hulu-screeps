import { Action } from "roomEngine/action/action";
import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/const/const";
import { UpgradeAction } from "roomEngine/action/upgradeAction";
import { TransferTargetType } from "task/instances/task_transfer";
import { UpgradeTargetType } from "task/instances/task_upgrade";

export class UpgradeScheduler extends Scheduler<UpgradeTargetType | TransferTargetType> {

    constructor(room: Room, role: RoleType) {
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<UpgradeTargetType | TransferTargetType> | undefined {
        switch (this.room.status) {
            case RoomStatusEnum.Low:
                return new Low(this.room, this.role)
            case RoomStatusEnum.Medium:
                return new Medium(this.room, this.role);
            case RoomStatusEnum.High:
                return new High(this.room, this.role);
            default:
                return undefined
        }
    }
}


class Low implements IRoomStrategy<UpgradeTargetType | TransferTargetType> {
    room: Room
    role: RoleType

    constructor(room: Room, role: RoleType) {
        this.room = room
        this.role = role
    }

    getTargets(): (UpgradeTargetType | TransferTargetType)[] {
        return this.room.controller ? [this.room.controller] : []
    }

    getAction(): ActionDetail<UpgradeTargetType | TransferTargetType> {
        let action: ActionGenerationType<UpgradeTargetType>;
        switch (this.role) {
            case 'worker':
                action = UpgradeAction.workerUpgrade
                break
            default:
                throw Error(`UpgradeScheduler的${this.room.status}策略未实现${this.role}的action方法`)
        }
        return {
            actionMethod: action as any,
        }
    }

}

class Medium implements IRoomStrategy<UpgradeTargetType | TransferTargetType> {
    room: Room
    role: RoleType

    constructor(room: Room, role: RoleType) {
        this.room = room
        this.role = role
    }

    getTargets(): (UpgradeTargetType | TransferTargetType)[] {
        if (!this.room.controller) return []

        if (this.role == 'upgrader') {
            const controller = this.room.controller
            debugger
            //未找到container跳过生成
            if (!controller.container) return []

            //如果有upgrader同时upgrader的数量大于等于闲置且有能量的carrier数量-1，跳过
            if (this.room.creeps('upgrader').length > 0 &&
                this.room.creeps('upgrader').length >=
                this.room.idleCreeps('carrier').filter(c => c.store[RESOURCE_ENERGY] > 0).length - 1) return []

            //如果房间有storage但能量不符合要求 且 掉级时间大于500tick时，跳过
            if (this.room.storage) {
                const energyLevelDeviation = (this.room.storage.store[RESOURCE_ENERGY] - (this.room.level - 3.5) * 10000) / 100000
                if (energyLevelDeviation <= this.room.creeps('upgrader', false).length &&
                    controller.ticksToDowngrade > 500 &&
                    this.room.storage.store[RESOURCE_ENERGY] < 10000) {
                    return []
                }
            }

            return [this.room.controller]
        }
        else if (this.role == 'worker') {
            return [this.room.controller]
        }
        else if (this.role == 'carrier') {
            if (!this.room.controller) return []
            const container = this.room.controller.container
            if (!container) return []

            //有link时 检查link+container总容量是否小于800 或者link为空  todo
            if ((container.getCurrentStoreResource(RESOURCE_ENERGY) || 0) > 1800) return []

            return [container]
        }
        else {
            return []
        }
    }

    getAction(): ActionDetail<UpgradeTargetType | TransferTargetType> {
        let action: any;
        switch (this.role) {
            case 'upgrader':
                action = UpgradeAction.upgraderUpgrade
                break
            case 'carrier':
                action = Action.transferResource
                break
            case 'worker':
                action = UpgradeAction.workerUpgrade
                break
            default:
                throw Error(`UpgradeScheduler的${this.room.status}策略未实现${this.role}的action方法`)
        }
        return {
            actionMethod: action,
        }
    }

}

class High implements IRoomStrategy<UpgradeTargetType | TransferTargetType> {
    room: Room
    role: RoleType

    constructor(room: Room, role: RoleType) {
        this.room = room
        this.role = role
    }

    getTargets(): (UpgradeTargetType | TransferTargetType)[] {
        if (!this.room.controller) return []

        if (this.role == 'upgrader') {
            const controller = this.room.controller
            debugger
            //未找到container跳过生成
            if (!controller.container) return []

            //如果有upgrader同时upgrader的数量大于等于闲置且有能量的carrier数量-1，跳过   //todo
            if (this.room.creeps('upgrader').length > 0 &&
                this.room.creeps('upgrader').length >=
                this.room.idleCreeps('carrier').filter(c => c.store[RESOURCE_ENERGY] > 0).length - 1) return []

            //如果房间有storage但能量不符合要求 且 掉级时间大于500tick时，跳过
            if (this.room.storage) {
                const energyLevelDeviation = (this.room.storage.store[RESOURCE_ENERGY] - (this.room.level - 3.5) * 10000) / 100000
                if (energyLevelDeviation <= this.room.creeps('upgrader', false).length &&
                    controller.ticksToDowngrade > 500 &&
                    this.room.storage.store[RESOURCE_ENERGY] < 10000) {
                    return []
                }
            }

            return [this.room.controller]
        }
        else if (this.role == 'worker') {
            return [this.room.controller]
        }
        else if (this.role == 'carrier') {
            if (!this.room.controller) return []
            const container = this.room.controller.container
            if (!container) return []

            //有link时 检查link+container总容量是否小于800 或者link为空  todo
            if ((container.getCurrentStoreResource(RESOURCE_ENERGY) || 0) > 1800) return []

            return [container]
        }
        else {
            return []
        }
    }

    getAction(): ActionDetail<UpgradeTargetType | TransferTargetType> {
        let action: any;
        switch (this.role) {
            case 'upgrader':
                action = UpgradeAction.upgraderUpgrade
                break
            case 'carrier':
                action = Action.transferResource
                break
            case 'worker':
                action = UpgradeAction.workerUpgrade
                break
            default:
                throw Error(`UpgradeScheduler的${this.room.status}策略未实现${this.role}的action方法`)
        }
        return {
            actionMethod: action,
        }
    }

}
