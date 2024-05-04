import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";
import { HarvestTargetType } from "./task_harvest";

@TaskRegistration<HarvestTargetType>()
export class TaskHarvestConstant extends Task<HarvestTargetType> {

    static taskName = 'harvest-constant'

    static createInstance(target: HarvestTargetType, options?: TaskOption) {
        return new TaskHarvestConstant(target, options)
    }

    constructor(target: HarvestTargetType, options = {} as TaskOption) {
        super(TaskHarvestConstant.taskName, target, options);

    }

    isValidTask(): boolean {
        return true
    }
    isValidTarget(): boolean {
        return true
    }

    work(): number {
        if (!this.target) {
            return OK
        }

        const container = this.target.container
        if (container && !container.pos.isEqualTo(this.creep.pos)) {
            return this.creep.moveTo(container)
        }

        if ((this.creep.ticksToLive || 0) % 3 == 0 || this.creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
            const nearFull = this.creep.store.getFreeCapacity(RESOURCE_ENERGY) < this.creep.getActiveBodyparts(WORK) * 2
            if (nearFull) {
                const site = this.creep.room.constructionSites.filter(s => s.pos.isNearTo(this.creep.pos)).shift()
                if (site) {
                    this.creep.build(site)
                }
                else if (container && container.hits / container.hitsMax < 0.9) {
                    this.creep.repair(container)
                }
                else {

                }
            }

            // if (container && container.store.getUsedCapacity(RESOURCE_ENERGY) > this.creep.getActiveBodyparts(CARRY) * CARRY_CAPACITY) {
            //     this.creep.withdraw(container, RESOURCE_ENERGY)
            // }
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

        if (this.isSource(this.target)) {
            if ((this.target.energy + 300) / this.target.energyCapacity > (this.target.ticksToRegeneration || 300) / 300 && this.target.energy) {
                return this.creep.harvest(this.target)
            }
            else {
                return OK
            }
        }
        else {
            return this.target.mineralAmount - 1 > 0 ? this.creep.harvest(this.target) : OK;
        }
    }

    private isSource(obj: Source | Mineral): obj is Source {
        return (obj as Source).energy != undefined;
    }

}

