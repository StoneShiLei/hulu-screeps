import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type GetRenewedTargetType = StructureSpawn

@TaskRegistration<GetRenewedTargetType>()
export class TaskGetRenewed extends Task<GetRenewedTargetType> {

    static taskName = 'getrenewed'

    static createInstance(target: GetRenewedTargetType, options?: TaskOption) {
        return new TaskGetRenewed(target, options)
    }

    constructor(target: GetRenewedTargetType, option = {} as TaskOption) {
        super(TaskGetRenewed.taskName, target, option)
    }

    isValidTask(): boolean {
        let hasClaimPart = _.filter(this.creep.body, (part: BodyPartDefinition) => part.type == CLAIM).length > 0;
        if (hasClaimPart) return false
        return this.creep.ticksToLive != undefined && this.creep.ticksToLive < 0.9 * CREEP_LIFE_TIME;
    }
    isValidTarget(): boolean {
        return !!this.target && this.target.my
    }
    work(): number {
        if (!!this.target) {
            return this.target.renewCreep(this.creep);
        }
        else {
            return this.finish()
        }
    }

}
