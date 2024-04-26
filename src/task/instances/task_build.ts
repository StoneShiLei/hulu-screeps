import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "./task";

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
        return !!this.target && this.target.my && this.target.progress < this.target.progressTotal
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
