import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export const MIN_LIFETIME_FOR_BOOST = 0.9;
export type GetBoostedTargetType = StructureLab

@TaskRegistration<GetBoostedTargetType>()
export class TaskGetBoosted extends Task<GetBoostedTargetType> {

    static taskName = 'boost'

    static createInstance(target: GetBoostedTargetType, options?: TaskOption) {
        return new TaskGetBoosted(target, options)
    }

    constructor(target: GetBoostedTargetType, option = {} as TaskOption) {
        super(TaskGetBoosted.taskName, target, option)
        this.data.resourceType = option.boostType
        this.data.amount = option.partCount

        if (!this.data.resourceType) throw new Error('未定义boost类型')
    }

    isValidTask(): boolean {
        if (!this.creep.ticksToLive) return true //未出生的creep没有ttl

        const ttl = _.any(this.creep.body, part => part.type == CLAIM) ? CREEP_CLAIM_LIFE_TIME : CREEP_LIFE_TIME

        //如果ttl小于指定值则跳过boost任务
        if (this.creep.ticksToLive < MIN_LIFETIME_FOR_BOOST * ttl) return false

        if (!this.data.resourceType) return false

        const partCount = this.data.amount || this.creep.getActiveBodyparts(boostParts[this.data.resourceType])
        return (_.countBy(this.creep.body, b => b.boost)[this.data.resourceType] || 0) < partCount //当boost达到目标数量时停止
    }
    isValidTarget(): boolean {
        return true //如果没有能量或矿物输入，会阻塞此creep行动，todo：设置超时器
    }
    work(): number {
        if (!!this.target && !!this.data.resourceType) {
            const partCount = this.data.amount || this.creep.getActiveBodyparts(boostParts[this.data.resourceType])
            if (this.target.mineralType == this.data.resourceType &&
                this.target.store[this.data.resourceType] >= LAB_BOOST_MINERAL * partCount &&
                this.target.store[RESOURCE_ENERGY] >= LAB_BOOST_ENERGY * partCount
            ) {
                return this.target.boostCreep(this.creep, this.data.amount)
            }
            else {
                return ERR_NOT_FOUND
            }
        }
        else {
            return this.finish()
        }
    }

}


const boostParts: { [boostType: string]: BodyPartConstant } = {

    'UH': ATTACK,
    'UO': WORK,
    'KH': CARRY,
    'KO': RANGED_ATTACK,
    'LH': WORK,
    'LO': HEAL,
    'ZH': WORK,
    'ZO': MOVE,
    'GH': WORK,
    'GO': TOUGH,

    'UH2O': ATTACK,
    'UHO2': WORK,
    'KH2O': CARRY,
    'KHO2': RANGED_ATTACK,
    'LH2O': WORK,
    'LHO2': HEAL,
    'ZH2O': WORK,
    'ZHO2': MOVE,
    'GH2O': WORK,
    'GHO2': TOUGH,

    'XUH2O': ATTACK,
    'XUHO2': WORK,
    'XKH2O': CARRY,
    'XKHO2': RANGED_ATTACK,
    'XLH2O': WORK,
    'XLHO2': HEAL,
    'XZH2O': WORK,
    'XZHO2': MOVE,
    'XGH2O': WORK,
    'XGHO2': TOUGH,

};
