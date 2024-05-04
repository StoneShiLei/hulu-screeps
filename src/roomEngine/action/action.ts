import { TaskHelper } from "task/TaskHelper"
import { HarvestTargetType } from "task/instances/task_harvest"
import { PickupTargetType } from "task/instances/task_pickup"
import { WithdrawTargetType } from "task/instances/task_withdraw"

type TakeResourceType = PickupTargetType | HarvestTargetType | WithdrawTargetType

export abstract class Action implements IAction {

    private static dropedResourceMap: {
        [roomName: string]: (PickupTargetType | WithdrawTargetType)[]
    } = {}

    protected static genTaskList(creep: Creep, ...tasks: ITask[]): ITask[] {
        if (!creep.isEmptyStore) return tasks

        const target = creep.pos.findClosestByPath(Action.findResource(creep.room), { ignoreCreeps: true })
        if (!target) return tasks

        return [Action.genTakeResourceTask(target), ...tasks]
    }

    private static findResource(room: Room, type: ResourceConstant = RESOURCE_ENERGY): TakeResourceType[] {
        let targets: TakeResourceType[]
        targets = this.findDroped(room, type)
        if (!targets) return []
        targets = this.findMassStore(room, type)
        if (!targets) return []
        targets = this.findOriginResource(room, type)
        if (!targets) return []

        return targets
    }

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

    private static updateDropedMap(room: Room): void {
        Action.dropedResourceMap[room.name] = Action.dropedResourceMap[room.name] || []
        let droped: (PickupTargetType | WithdrawTargetType)[] = []
        droped = droped.concat(room.find(FIND_DROPPED_RESOURCES).filter(x => x.amount > 100))
        droped = droped.concat(room.find(FIND_TOMBSTONES).filter(x => x.store.getUsedCapacity() > 100))
        droped = droped.concat(room.find(FIND_RUINS).filter(x => x.store.getUsedCapacity() > 100))
        this.dropedResourceMap[room.name] = droped
    }

    private static findDroped(room: Room, type: ResourceConstant): (PickupTargetType | WithdrawTargetType)[] {
        if (room.hashTime % 9 == 0) this.updateDropedMap(room)

        return this.dropedResourceMap[room.name]?.filter(d => {
            if ('store' in d) {
                return d.store[type] > 100
            }
            else {
                return d.amount > 100
            }
        }) || []
    }

    private static findMassStore(room: Room, type: ResourceConstant): WithdrawTargetType[] {
        return room.massStores.filter(s => {
            if (s.structureType == STRUCTURE_CONTAINER) {
                return s.store[type] > 100
            }
            else if (s.structureType == STRUCTURE_STORAGE) {
                return s.store[type] > 2000
            }
            else if (s.structureType == STRUCTURE_TERMINAL) {
                return s.store[type] > 2000
            }
            else if (s.structureType == STRUCTURE_FACTORY) {
                return s.store[type] > 2000
            }
            else {
                return false
            }
        }) || []
    }

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
            const f = (source: Source) => {
                const energyAvailable = source.energy > 0
                const canWorkPosLen = source.pos.surroundPos(1).filter(pos => pos.isWalkable()).length
                const targetedLen = source.targetedBy.length

                return energyAvailable && canWorkPosLen * 1.5 - targetedLen > 0
            }
            return room.sources.filter(f)
        }
        else {
            return room.mineral?.mineralType == type && room.mineral.mineralAmount > 0 ? [room.mineral] : []
        }
    }
}
