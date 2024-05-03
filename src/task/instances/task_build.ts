import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type BuildTargetType = ConstructionSite

@TaskRegistration<BuildTargetType>()
export class TaskBuild extends Task<BuildTargetType> {

    static taskName = 'build'

    static createInstance(target: BuildTargetType, options?: TaskOption) {
        return new TaskBuild(target, options)
    }

    constructor(target: BuildTargetType, option = {} as TaskOption) {
        super(TaskBuild.taskName, target, option)
        this.setting.targetRange = 3
    }

    isValidTask(): boolean {
        return this.creep.store.energy > 0
    }
    isValidTarget(): boolean {
        if (!!this.target && this.target.my && this.target.progress < this.target.progressTotal) {
            return true
        }
        else {
            //更新房间建筑缓存
            this.target?.structureType ? this.creep.room.update(this.target.structureType) : this.creep.room.update()
            return false
        }
    }
    work(): number {
        if (!!this.target && this.target.my) {
            return this.creep.build(this.target)
        }
        else {
            return this.finish()
        }
    }

}
