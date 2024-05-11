import { Scheduler } from "./scheduler";
import { SourceAction } from "roomEngine/action/sourceAction";
import { SourceHarvestTargetType } from "task/instances/task_sourceHarvest";


export class SourceScheduler extends Scheduler<SourceHarvestTargetType> {

    constructor(room: Room) {
        const role: RoleType = 'sourceHarvester'
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<SourceHarvestTargetType> | undefined {
        return new Default(this.room, this.role);
    }
}

class Default implements IRoomStrategy<SourceHarvestTargetType> {
    room: Room
    role: RoleType

    constructor(room: Room, role: RoleType) {
        this.room = room
        this.role = role
    }

    getTargets(): SourceHarvestTargetType[] {
        //如果没有能运送的则跳过，防止只挖不运
        if (this.room.creeps('carrier', false).length + this.room.creeps('worker', false).length == 0) {
            return []
        }

        const targets = this.room.sources.filter(s =>
            s.targetedBy.filter(c => c.role == this.role).length == 0 ||
            s.targetedBy.filter(c => c.role == this.role && (c.ticksToLive || 1500) < 300).length > 0 &&
            s.targetedBy.filter(c => c.role == this.role && (c.ticksToLive || 1500) > 300).length == 0)

        return targets
    }
    getAction(): ActionDetail<SourceHarvestTargetType> {
        return {
            actionMethod: SourceAction.constantHarvest,
            options: {
                resourceType: RESOURCE_ENERGY
            }
        }
    }

}
