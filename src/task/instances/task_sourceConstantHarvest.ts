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


        if ((this.target.energy + 300) / this.target.energyCapacity > (this.target.ticksToRegeneration || 300) / 300 && this.target.energy) {
            this.creep.harvest(this.target)
        }


        const container = this.target.container
        const link = findSuitableLink(this.target.links)

        if ((this.creep.ticksToLive || 0) % 3 == 0 || this.creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
            // debugger
            const nearFull = this.creep.store.getFreeCapacity(RESOURCE_ENERGY) < this.creep.getActiveBodyparts(WORK) * 2
            const linkNotFull = link && link.store.energy != 800
            if (nearFull) {
                const site = this.creep.room.constructionSites.filter(s => s.pos.isNearTo(this.creep.pos)).shift()
                if (site) {
                    this.creep.build(site)
                }
                else if (container && container.hits / container.hitsMax < 0.9) {
                    this.creep.repair(container)
                }
                else if (link && link.hits / link.hitsMax < 0.9) {
                    this.creep.repair(link)
                }
                else {

                }
            }

            if (container && linkNotFull) {
                if (nearFull) this.creep.transfer(link, RESOURCE_ENERGY)
                if (container.store.getUsedCapacity(RESOURCE_ENERGY) > this.creep.store.getCapacity()) {
                    this.creep.withdraw(container, RESOURCE_ENERGY)
                }
            }

        }

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

        return OK
    }
}

function findSuitableLink(links: StructureLink[]): StructureLink | undefined {
    // debugger
    let link1 = links[0]
    let link2 = links[1]
    if (!link1) link1 = link2
    if (link1 && link2 && link1.store.energy > link2.store.energy && link1.store.energy == 800) {
        link1 = link2
    }
    return link1
}
