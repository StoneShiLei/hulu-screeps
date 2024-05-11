import { TaskRegistration } from "task/helper/TaskRegistry";
import { Task } from "../task";
import { TaskGetRecycled } from "./task_getRecycled";

export type MineralHarvestTargetType = Mineral

@TaskRegistration<MineralHarvestTargetType>()
export class TaskMineralHarvest extends Task<MineralHarvestTargetType> {

    static taskName = 'mineralHarvest'

    static createInstance(target: MineralHarvestTargetType, options?: TaskOption) {
        return new TaskMineralHarvest(target, options)
    }

    constructor(target: MineralHarvestTargetType, options = {} as TaskOption) {
        super(TaskMineralHarvest.taskName, target, options);

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

        const container = this.target.room?.extractor?.container
        if (!container || container.store.getFreeCapacity() < 80) return OK

        //当mineral为0时，回收或消除creep
        if (this.target.mineralAmount == 0) {
            if ((this.creep.ticksToLive || 1500) > 600) {
                this.creep.pressTaskAndRun(new TaskGetRecycled(this.creep.belongRoom.spawns[0]))
            }
            else {
                this.creep.suicide()
            }
        }

        if ((this.creep.ticksToLive || 0) % 6 == 0) this.creep.harvest(this.target)

        if ((this.creep.ticksToLive || 0) % 6 <= 1) {
            const droped = this.creep.pos.lookFor(LOOK_RESOURCES).shift()
            if (droped) {
                this.creep.pickup(droped)
                if (container) this.creep.transfer(container, this.target.mineralType)
            }
            const tomb = this.creep.pos.lookFor(LOOK_TOMBSTONES).shift()
            if (tomb) {
                this.creep.withdraw(tomb, this.target.mineralType)
                if (container) this.creep.transfer(container, this.target.mineralType)
            }
        }

        return OK
    }
}
