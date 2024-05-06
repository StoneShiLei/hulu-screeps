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
        let lifetime = hasClaimPart ? CREEP_CLAIM_LIFE_TIME : CREEP_LIFE_TIME;
        return this.creep.ticksToLive != undefined && this.creep.ticksToLive < 0.9 * lifetime;
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
