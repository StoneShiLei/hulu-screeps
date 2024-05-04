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
        if (this._currentResource[type]) return this._currentResource[type] + store[type]

        let currentResourceCount = 0

        const creeps = this.targetedBy

        creeps.forEach(creep => {
            let task = creep.memory.task
            while (task) {
                const taskName = task.name
                const taskType = task.data.resourceType
                if (taskName == TaskTransfer.taskName && taskType == type) {
                    if (task.data.amount) currentResourceCount += task.data.amount
                    else currentResourceCount += creep.store.getCapacity(type)
                }
                else if (taskName == TaskWithdraw.taskName && taskType == type) {
                    if (task.data.amount) currentResourceCount -= task.data.amount
                    else currentResourceCount -= creep.store.getCapacity(type)
                }
                else {

                }
                task = task._parent
            }
        })

        if (!this._currentResource[type]) this._currentResource[type] = 0
        this._currentResource[type] += currentResourceCount

        return this._currentResource[type] + store[type]
    }
}


