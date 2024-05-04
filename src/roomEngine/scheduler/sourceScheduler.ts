import { HarvestTargetType } from "task/instances/task_harvest";
import { Scheduler } from "./scheduler";
import { SourceAction } from "roomEngine/action/sourceAction";
import { RoomStatusEnum } from "global/const/const";

export class SourceScheduler extends Scheduler<HarvestTargetType> {

    constructor(room: Room, role: RoleType) {
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<HarvestTargetType> | undefined {
        return new Default(this.room, this.role);
    }
}

class Default implements IRoomStrategy<HarvestTargetType> {
    room: Room
    role: RoleType

    constructor(room: Room, role: RoleType) {
        this.room = room
        this.role = role
    }

    getTargets(): HarvestTargetType[] {
        const targets = this.room.sources.filter(s =>
            s.targetedBy.filter(c => c.role == this.role).length == 0 ||
            s.targetedBy.filter(c => c.role == this.role && (c.ticksToLive || 1500) < 300).length > 0)
        return targets
    }
    getAction(): ActionDetail<HarvestTargetType> {
        return {
            actionMethod: SourceAction.constantHarvest
        }
    }

}
