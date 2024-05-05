import { TaskHelper } from "task/TaskHelper"
import { HarvestTargetType } from "task/instances/task_harvest"
import { PickupTargetType } from "task/instances/task_pickup"
import { TransferTargetType } from "task/instances/task_transfer"
import { WithdrawTargetType } from "task/instances/task_withdraw"

type TakeResourceType = PickupTargetType | HarvestTargetType | WithdrawTargetType

export abstract class Action implements IAction {

    /**
     * 取出资源，调用一次仅给第一个target指派1个creep
     * @param targets
     * @param role
     * @param room
     * @param options
     * @returns
     */
    static withdrawResource(targets: WithdrawTargetType[], role: RoleType, room: Room, options?: ActionOptions) {
        return function () {
            room.idleCreeps(role).filter(c => c.isEmptyStore).forEach(creep => {
                const target = targets.shift()
                if (!target) return
                creep.task = TaskHelper.withdraw(target, options)
            })
        }
    }

    /**
     * 转入资源，1个目标指派若干个creep
     * @param targets
     * @param role
     * @param room
     * @param options
     * @returns
     */
    static transferResource(targets: TransferTargetType[], role: RoleType, room: Room, options?: ActionOptions) {
        return function () {
            const creeps = room.idleCreeps(role)

            targets.forEach(target => {
                creeps.forEach(creep => {
                    const task = TaskHelper.transfer(target, options)
                    const tasks = Action.genTaskList(creep, RESOURCE_ENERGY, task)
                    creep.task = TaskHelper.chain(tasks)
                })
            })

        }
    }

    /**
     * 转入资源，1个目标指派若干个creep，不自动获取资源
     * @param targets
     * @param role
     * @param room
     * @param options
     * @returns
     */
    static transferAllResource(targets: TransferTargetType[], role: RoleType, room: Room, options?: ActionOptions) {
        return function () {
            const creeps = room.idleCreeps(role).filter(c => !c.isEmptyStore)

            targets.forEach(target => {
                creeps.forEach(creep => {
                    const task = TaskHelper.transfer(target, options)
                    creep.task = task
                })
            })

        }
    }

    /**
     * 掉落资源map
     */
    private static dropedResourceMap: {
        [roomName: string]: (PickupTargetType | WithdrawTargetType)[]
    } = {}

    /**
     * 生成task列表，用于给creep补充资源
     * @param creep 要添加任务的creep
     * @param type 要补充的资源类型
     * @param tasks 原始任务
     * @returns
     */
    protected static genTaskList(creep: Creep, type: ResourceConstant, ...tasks: ITask[]): ITask[] {
        //资源已满的话直接返回原本的任务
        if (creep.store.getUsedCapacity(type) == creep.store.getCapacity(type)) return tasks

        // todo 如果当前需求资源和体内资源不一致时，添加一个清空体内资源的任务

        //防止取资源的目标和填资源的目标是同一个
        const resources = Action.findResource(creep.room, type, creep.getActiveBodyparts(WORK) == 0).filter(s => !_.some(tasks, task => task.target?.ref == s.id))

        //资源未满时，先把资源补满再执行任务
        const target = creep.pos.findClosestByPath(resources, { ignoreCreeps: true })
        if (!target && creep.isEmptyStore) return [] //emptyStore且找不到获取资源的目标时，不返回任何task
        if (!target) return tasks //没有资源目标时，用现有的资源进行任务
        return [Action.genTakeResourceTask(target), ...tasks]
    }

    /**
     * 查找可用资源
     * @param room
     * @param type
     * @param ignoreOriginResource 忽略原始资源
     * @returns
     */
    private static findResource(room: Room, type: ResourceConstant = RESOURCE_ENERGY, ignoreOriginResource: boolean = false): TakeResourceType[] {
        let targets: TakeResourceType[]
        targets = this.findDroped(room, type)
        if (targets.length) return targets
        targets = this.findMassStore(room, type)
        if (targets.length) return targets

        if (!ignoreOriginResource) {
            targets = this.findOriginResource(room, type)
            if (targets.length) return targets
        }

        return targets
    }

    /**
     * 根据目标类型生成任务
     * @param target
     * @returns
     */
    private static genTakeResourceTask(target: TakeResourceType): ITask {
        if ('store' in target) {
            return TaskHelper.withdraw(target)
        }
        else if ('amount' in target) {
            return TaskHelper.pickup(target)
        }
        else {
            return TaskHelper.harvest(target)
        }
    }

    /**
     * 更新掉落资源列表
     * @param room
     */
    private static updateDropedMap(room: Room): void {
        Action.dropedResourceMap[room.name] = Action.dropedResourceMap[room.name] || []
        let droped: (PickupTargetType | WithdrawTargetType)[] = []
        droped = droped.concat(room.find(FIND_DROPPED_RESOURCES).filter(x => x.amount > 100))
        droped = droped.concat(room.find(FIND_TOMBSTONES).filter(x => x.store.getUsedCapacity() > 100))
        droped = droped.concat(room.find(FIND_RUINS).filter(x => x.store.getUsedCapacity() > 100))
        this.dropedResourceMap[room.name] = droped
    }

    /**
     * 查找掉落资源
     * @param room
     * @param type
     * @returns
     */
    private static findDroped(room: Room, type: ResourceConstant): (PickupTargetType | WithdrawTargetType)[] {
        if (room.hashTime % 9 == 0 || Action.dropedResourceMap[room.name] === undefined) this.updateDropedMap(room)

        return this.dropedResourceMap[room.name]?.filter(d => {
            if ('store' in d) {
                return d.store[type] > 100
            }
            else {
                return d.amount > 100
            }
        }) || []
    }

    /**
     * 查找大容量存储
     * @param room
     * @param type
     * @returns
     */
    private static findMassStore(room: Room, type: ResourceConstant): WithdrawTargetType[] {
        return room.massStores.filter(s => {
            if (s.structureType == STRUCTURE_CONTAINER) {
                return s.store[type] > 600
            }
            else if (s.structureType == STRUCTURE_STORAGE) {
                return s.store[type] > 3000
            }
            else if (s.structureType == STRUCTURE_TERMINAL) {
                return s.store[type] > 3000
            }
            else if (s.structureType == STRUCTURE_FACTORY) {
                return s.store[type] > 3000
            }
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
