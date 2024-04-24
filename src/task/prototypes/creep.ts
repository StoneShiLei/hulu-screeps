import { initTask } from "task/initTask"

export class CreepExtension extends Creep {

    /**
     * task的get访问器
     * 如果没有task，尝试通过memory中的原型任务进行反序列化
     * @returns 当前任务
     */
    taskGetter(): ITask | null {
        if (!this._task) {
            let protoTask = this.memory.task
            this._task = protoTask ? initTask(protoTask) : null
        }
        return this._task
    }
    /**
     * task的set访问器
     * 将task序列化到memory中
     * 并将task的执行者置为当前creep
     * @param task 新的task
     */
    taskSetter(task: ITask | null) {
        this.memory.task = task ? task.proto : null
        if (task) {
            // if(task.target){
            //     if(!Game) cache
            // }
            task.creep = this
        }
        //清空临时缓存，更新get访问器
        this._task = null
    }
    /**
     * get访问器 是否有可执行的任务
     * @returns
     */
    hasValidTaskGetter(): boolean {
        return !!this.task && this.task.isValid()
    }
    /**
     * get访问器 是否为闲置
     * @returns
     */
    isIdleGetter(): boolean {
        return !this.hasValidTask
    }
    /**
     * 执行当前任务
     * @returns
     */
    run() {
        if (this.task) {
            return this.task.run()
        }
        return
    }
}
