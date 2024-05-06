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
        const thisProxy = this as unknown as StoreStructure
        if (thisProxy.store === undefined) return undefined

        const store = thisProxy.store


        const id = this.ref
        const trueAmount = store[type]

        this._currentResource = this._currentResource || {}
        if (this._currentResource[type]) {
            // if (this._currentResource[type] > store[type]) debugger
            // console.log(`读取缓存，目标ref:${id},        目标原始存储：${trueAmount},    目标结果存储：${this._currentResource[type] + store[type]}`)
            return this._currentResource[type] + store[type]
        }

        let currentResourceCount = 0

        const creeps = this.targetedBy

        let string = ''
        creeps.forEach(creep => {
            string += `名称:${creep.name},ID:${creep.id},`
            let task = creep.task // 这里不能使用creep.memory.task，会存在creep.task为null，但是creep.memory.task还没有来得及清除的情况
            while (task) {
                //跳过不是以此对象为目标的任务
                if (task.target?.ref !== this.ref) {
                    task = task.parent
                    continue
                }

                const taskName = task.name
                const taskType = task.data.resourceType
                string += `任务名称:${taskName},资源类型:${taskType},`
                if (taskName == TaskTransfer.taskName && taskType == type) {
                    if (task.data.amount) currentResourceCount += task.data.amount
                    else currentResourceCount += creep.store.getCapacity(type)
                    string += `影响资源:+${task.data.amount ? task.data.amount : creep.store.getCapacity(type)}|||`
                }
                else if (taskName == TaskWithdraw.taskName && taskType == type) {
                    if (task.data.amount) currentResourceCount -= task.data.amount
                    else currentResourceCount -= creep.store.getCapacity(type)
                    string += `影响资源:-${task.data.amount ? task.data.amount : creep.store.getCapacity(type)}|||`
                }
                else {
                    string += `影响资源:不影响|||`
                }
                task = task.parent
            }
        })

        if (!this._currentResource[type]) this._currentResource[type] = 0
        this._currentResource[type] += currentResourceCount

        // if (this._currentResource[type] > store[type]) debugger

        // console.log(`实时计算，目标ref:${id},        目标原始存储：${trueAmount},    目标结果存储：${this._currentResource[type] + store[type]},      目标工作者情况：${string}`)
        return this._currentResource[type] + store[type]
    }
}


