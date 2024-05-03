import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type SignTargetType = StructureController

@TaskRegistration<SignTargetType>()
export class TaskSign extends Task<SignTargetType> {

    static taskName = 'sign'

    static createInstance(target: SignTargetType, options?: TaskOption) {
        return new TaskSign(target, options)
    }

    constructor(target: SignTargetType, option = {} as TaskOption) {
        super(TaskSign.taskName, target, option)
        this.data.signature = this.option.signature
    }

    isValidTask(): boolean {
        return true
    }
    isValidTarget(): boolean {
        return !!this.target && (!this.target.sign || this.target.sign.text != this.data.signature)
    }
    work(): number {
        if (!!this.target) {
            return this.creep.signController(this.target, this.data.signature || "")
        }
        else {
            return this.finish()
        }
    }

}
