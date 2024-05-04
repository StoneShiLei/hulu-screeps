import { TargetCache } from "task/helper/TargetCache";
import { TaskTransfer } from "task/instances/task_transfer";
import { TaskWithdraw } from "task/instances/task_withdraw";


interface PossibleRef {
    id?: string;
    name?: string;
}


export class RoomObjectExtension extends RoomObject {

    _currentResource: {
        [type: string]: number
    } | undefined

    /**
     * get访问器 获取当前实体的id或name
     * @returns
     */
    refGetter(this: PossibleRef): string {

        if (this.id) {
            return this.id;
        } else if (this.name) {
            return this.name;
        } else {
            return '';
        }
    }

    targetedByGetter(): Creep[] {
        TargetCache.assert()
        return _.map(Game.TargetCache.targets[this.ref], name => Game.creeps[name])
    }

    getCurrentStoreResource(type: ResourceConstant): number | undefined {
        if (!('store' in this)) return undefined
        const store = this.store as StoreDefinition

        this._currentResource = this._currentResource || {}
        this._currentResource[type] = this._currentResource[type] || store[type] || 0

        if (this._currentResource[type]) return this._currentResource[type]

        let currentResourceCount = 0

        const creeps = this.targetedBy

        creeps.forEach(creep => {
            if (!creep.task) return
            const taskName = creep.task.name
            const taskType = creep.task.data.resourceType
            if (taskName == TaskTransfer.taskName && taskType == type) {
                if (creep.task.data.amount) currentResourceCount += creep.task.data.amount
                else currentResourceCount += creep.store.getUsedCapacity(type)
            }
            else if (taskName == TaskWithdraw.taskName && taskType == type) {
                if (creep.task.data.amount) currentResourceCount -= creep.task.data.amount
                else currentResourceCount -= creep.store.getUsedCapacity(type)
            }
            else {

            }
        })

        this._currentResource[type] += currentResourceCount
        return this._currentResource[type]
    }
}


