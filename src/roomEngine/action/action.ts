import { TaskHelper } from "task/TaskHelper"
import { HarvestTargetType } from "task/instances/task_harvest"
import { PickupTargetType } from "task/instances/task_pickup"
import { TransferTargetType } from "task/instances/task_transfer"
import { WithdrawTargetType } from "task/instances/task_withdraw"
import { WithdrawAllTargetType } from "task/instances/task_withdrawAll"

type TakeResourceType = PickupTargetType | HarvestTargetType | WithdrawTargetType

export abstract class Action implements IAction {

    /**
     * 取出全部类型资源，给每个creep指派1个target
     * @param targets
     * @param role
     * @param room
     * @param options
     * @returns
     */
    static withdrawAllResource(targets: WithdrawAllTargetType[], role: RoleType, room: Room, options: ActionOptions = {}) {
        return function () {
            room.idleCreeps(role).filter(c => c.isEmptyStore).forEach(creep => {
                const target = targets.shift()
                if (!target) return
                creep.task = TaskHelper.withdrawAll(target, options)
            })
        }
    }

    /**
     * 取出资源，给每个creep指派1个target
     * @param targets
     * @param role
     * @param room
     * @param options
     * @returns
     */
    static withdrawResource(targets: WithdrawTargetType[], role: RoleType, room: Room, options: ActionOptions = {}) {
        return function () {
            room.idleCreeps(role).filter(c => c.isEmptyStore).forEach(creep => {
                const target = targets.shift()
                if (!target) return
                creep.task = TaskHelper.withdraw(target, options)
            })
        }
    }

    /**
     * 转入资源，给每个creep指派1个target
     * @param targets
     * @param role
     * @param room
     * @param options
     * @returns
     */
    static transferResource(targets: TransferTargetType[], role: RoleType, room: Room, options: ActionOptions = {}) {
        return function () {
            room.idleCreeps(role).forEach(creep => {
                const target = targets.shift()
                if (!target) return
                const task = TaskHelper.transfer(target, options)

                const takeResourceType = options.resourceType || RESOURCE_ENERGY
                const withdrawAmount = options.amount || (target.store.getFreeCapacity(takeResourceType) || undefined)

                const tasks = Action.genTaskList(creep, { resourceType: takeResourceType, amount: withdrawAmount }, task)
                creep.task = TaskHelper.chain(tasks)
            })
        }
    }

    /**
     * 生成task列表，用于给creep补充资源
     * @param creep 要添加任务的creep
     * @param tasks 原始任务
     * @param options 设置
     * @returns
     */
    protected static genTaskList(creep: Creep, options: ActionOptions = {}, ...tasks: ITask[]): ITask[] {
        options.resourceType = options.resourceType || RESOURCE_ENERGY

        //资源已满的话直接返回原本的任务
        if (creep.store.getUsedCapacity(options.resourceType) == creep.store.getCapacity(options.resourceType)) return tasks

        //防止取资源的目标和填资源的目标是同一个
        const resources = Action.findResource(creep, options.resourceType)
            .filter(s => !_.some(tasks, task => task.target?.ref == s.id))

        //资源未满时，先把资源补满再执行任务
        const target = creep.pos.findClosestByPath(resources, { ignoreCreeps: true })
        if (!target && creep.isEmptyStore) return [] //emptyStore且找不到获取资源的目标时，不返回任何task
        if (!target) return tasks //没有资源目标时，用现有的资源进行任务

        //如果有设置取用数量且目标包含store属性，则设置取用数量为目标可用数量
        if (options.amount && 'store' in target) {
            options.amount = Math.min(creep.store.getFreeCapacity(options.resourceType), Math.min(target.store[options.resourceType], options.amount))
        }

        return [Action.genTakeResourceTask(target, options), ...tasks]
    }

    /**
     * 查找可用资源
     * @param creep
     * @param type
     * @returns
     */
    protected static findResource(creep: Creep, type: ResourceConstant = RESOURCE_ENERGY): TakeResourceType[] {
        let targets: TakeResourceType[]

        //creep没有carry则不返回资源目标
        if (creep.getActiveBodyparts(CARRY) == 0) return []

        //仅当房间没有carrier时 其他角色在补充资源时才考虑掉落资源，否则由carrier负责捡起
        if (creep.room.creeps('carrier', false), this.length == 0) {
            targets = this.findDroped(creep.room, type)
            if (targets.length) return targets
        }

        //大容量存储
        targets = this.findMassStore(creep.room, type)
        if (targets.length) return targets

        //没有work组件跳过原始资源点
        if (creep.getActiveBodyparts(WORK) > 0) {
            targets = this.findOriginResource(creep.room, type)
            if (targets.length) return targets
        }

        return targets
    }

    /**
     * 根据目标类型生成任务
     * @param target
     * @param amount withdraw的数量
     * @returns
     */
    protected static genTakeResourceTask(target: TakeResourceType, options?: ActionOptions): ITask {
        if ('store' in target) {
            return TaskHelper.withdraw(target, options)
        }
        else if ('amount' in target) {
            return TaskHelper.pickup(target)
        }
        else {
            return TaskHelper.harvest(target)
        }
    }

    /**
     * 查找掉落资源
     * @param room
     * @param type
     * @returns
     */
    private static findDroped(room: Room, type: ResourceConstant): (PickupTargetType | WithdrawTargetType)[] {
        return room.drops.filter(d => {
            if ('store' in d) {
                return d.store[type] > 100
            }
            else {
                return d.amount > 100
            }
        })
    }

    /**
     * 查找大容量存储
     * @param room
     * @param type
     * @returns
     */
    private static findMassStore(room: Room, type: ResourceConstant): WithdrawTargetType[] {

        if (room.storage && room.storage.store[type] > 3000) return [room.storage]

        return room.massStores.filter(s => {
            if (s.structureType == STRUCTURE_CONTAINER) {
                return (s.getCurrentStoreResource(type) || 0) >
                    (room.level == 8 ? 1600 : room.needFillSpawn ? 1200 : 500)
            }
            else if (s.structureType == STRUCTURE_STORAGE) {
                return (s.getCurrentStoreResource(type) || 0) > 3000
            }
            else if (s.structureType == STRUCTURE_TERMINAL) {
                return (s.getCurrentStoreResource(type) || 0) > 3000
            }
            // else if (s.structureType == STRUCTURE_FACTORY) {
            //     return s.store[type] > 3000
            // }
            else {
                return false
            }
        }) || []
    }

    /**
     * 查找原始资源，比如能量和矿
     * @param room
     * @param type
     * @returns
     */
    private static findOriginResource(room: Room, type: ResourceConstant): HarvestTargetType[] {

        if (type != RESOURCE_ENERGY &&
            type != RESOURCE_UTRIUM &&
            type != RESOURCE_LEMERGIUM &&
            type != RESOURCE_KEANIUM &&
            type != RESOURCE_ZYNTHIUM &&
            type != RESOURCE_OXYGEN &&
            type != RESOURCE_HYDROGEN &&
            type != RESOURCE_CATALYST) {
            return []
        }

        if (type == RESOURCE_ENERGY) {
            return room.sources.filter(s => s.canHarvest).sort((a, b) => b.energy - a.energy)
        }
        else {
            return room.mineral?.mineralType == type && room.mineral.mineralAmount > 0 ? [room.mineral] : []
        }
    }
}
