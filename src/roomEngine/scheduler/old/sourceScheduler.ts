import { HarvestTargetType } from "task/instances/task_harvest";
import { Scheduler } from "../scheduler";
import { SourceAction } from "roomEngine/action/sourceAction";
import { RoomStatusEnum } from "global/const/const";

export class SourceScheduler extends Scheduler<HarvestTargetType> {

    constructor(room: Room, role: RoleType) {
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<HarvestTargetType> | undefined {
        // switch (this.room.status) {
        //     case RoomStatusEnum.Low:
        //         return new Low(this.room)
        //     case RoomStatusEnum.Medium:
        //         return new Medium(this.room);
        //     case RoomStatusEnum.High:
        //         return new High(this.room);
        //     default:
        //         return undefined
        // }
        return undefined
    }
}


class Low implements IRoomStrategy<HarvestTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): HarvestTargetType[] {
        const f = (source: Source) => {
            const energyAvailable = source.energy > 0
            const canWorkPosLen = source.pos.surroundPos(1).filter(pos => pos.isWalkable()).length
            const targetedLen = source.targetedBy.length

            return energyAvailable && canWorkPosLen * 1.5 - targetedLen > 0
        }

        return this.room.sources.filter(f).sort((a, b) => b.energy - a.energy)
    }
    getAction(): ActionDetail<HarvestTargetType> {
        return {
            actionMethod: SourceAction.harvest,
        }
    }

}

class Medium implements IRoomStrategy<HarvestTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): HarvestTargetType[] {
        throw new Error("Method not implemented.");
    }
    getAction(): ActionDetail<HarvestTargetType> {
        throw new Error("Method not implemented.");
    }

}


class High implements IRoomStrategy<HarvestTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): HarvestTargetType[] {
        throw new Error("Method not implemented.");
    }

    getAction(): ActionDetail<HarvestTargetType> {
        throw new Error("Method not implemented.");
    }

}
