import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";

export type SourceConstantHarvestTargetType = Source

@TaskRegistration<SourceConstantHarvestTargetType>()
export class TaskSourceConstantHarvest extends Task<SourceConstantHarvestTargetType> {

    static taskName = 'sourceConstantHarvest'

    static createInstance(target: SourceConstantHarvestTargetType, options?: TaskOption) {
        return new TaskSourceConstantHarvest(target, options)
    }

    constructor(target: SourceConstantHarvestTargetType, options = {} as TaskOption) {
        super(TaskSourceConstantHarvest.taskName, target, options);

    }

    isValidTask(): boolean {
        return true
    }
    isValidTarget(): boolean {
        return true
    }

    work(): number {
        if (!this.target) return OK

        //当有多个的时候，相遇时杀死ttl低的那个
        if (this.target.targetedBy.length > 1) {

            const harvesters = this.target.targetedBy.sort((a, b) => (a.ticksToLive || 0) - (b.ticksToLive || 0))
            for (let i = 0; i < harvesters.length; i++) {

                if (i + 1 == harvesters.length) break

                if (harvesters[i].pos.isNearTo(harvesters[i + 1].pos)) {
                    harvesters[i].suicide()
                }
            }
        }

        const container = this.target.container

        if ((this.creep.ticksToLive || 0) % 6 <= 1) {
            const droped = this.creep.pos.lookFor(LOOK_ENERGY).shift()
            if (droped) {
                this.creep.pickup(droped)
                if (container) this.creep.transfer(container, RESOURCE_ENERGY)
            }
            const tomb = this.creep.pos.lookFor(LOOK_TOMBSTONES).shift()
            if (tomb) {
                this.creep.withdraw(tomb, RESOURCE_ENERGY)
                if (container) this.creep.transfer(container, RESOURCE_ENERGY)
            }
        }



        if ((this.creep.ticksToLive || 0) % 3 == 0 || this.creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
            const nearFull = this.creep.store.getFreeCapacity(RESOURCE_ENERGY) < this.creep.getActiveBodyparts(WORK) * 2
            if (nearFull) {
                const site = this.creep.room.constructionSites.filter(s => s.pos.isNearTo(this.creep.pos)).shift()
                if (site) {
                    return this.creep.build(site)
                }
                else if (container && container.hits / container.hitsMax < 0.9) {
                    return this.creep.repair(container)
                }
                else {
                    //todo  维修link
                }
            }

            if (container && container.store.getUsedCapacity(RESOURCE_ENERGY) > this.creep.getActiveBodyparts(CARRY) * CARRY_CAPACITY) {
                this.creep.withdraw(container, RESOURCE_ENERGY)
            }
        }



        if ((this.target.energy + 300) / this.target.energyCapacity > (this.target.ticksToRegeneration || 300) / 300 && this.target.energy) {
            return this.creep.harvest(this.target)
        }

        return OK
    }
}

