import { TargetCache } from "task/helper/TargetCache";
import { initTask } from "task/task";
import { Logger } from "utils/Logger";

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

        //当被赋予新的任务时，将老任务的目标从目标缓存中删除
        TargetCache.assert();
        let oldProtoTask = this.memory.task
        if (oldProtoTask) {
            let oldRef = oldProtoTask._target.ref
            if (Game.TargetCache.targets[oldRef]) {
                _.remove(Game.TargetCache.targets[oldRef], name => name == this.name)
            }
        }

        //添加新任务
        this.memory.task = task ? task.proto : null
        if (task) {

            //如果目标存在，将目标加入到缓存中
            if (task.target) {
                if (!Game.TargetCache.targets[task.target.ref]) {
                    Game.TargetCache.targets[task.target.ref] = []
                }

                Game.TargetCache.targets[task.target.ref].push(this.name)
            }

            //将creep注册到任务上
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
    run(): number | undefined {
        if (this.task) {
            const name = `${this.task.name}`
            const res = this.task.run()
            if (Game.time % 3 == 0) this.say(name + ':' + res.toString())
            // //tick结束前再次验证任务，提前更新目标缓存
            // if (this._task) this.task.isValid()

            return res
        }
        return
    }
}
