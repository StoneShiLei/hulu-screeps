import { HarvestTargetType } from "task/instances/task_harvest";
import { Scheduler } from "./scheduler";
import { SourceAction } from "roomEngine/action/sourceAction";
import { RoomStatusEnum } from "global/const/const";

export class SourceScheduler extends Scheduler<HarvestTargetType> {

    constructor(room: Room, idleCreeps: Creep[]) {
        super(room, idleCreeps)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<HarvestTargetType> | undefined {
        switch (this.room.status) {
            case RoomStatusEnum.Low:
                return new Low(this.room)
            case RoomStatusEnum.Medium:
                return new Medium(this.room);
            case RoomStatusEnum.High:
                return new High(this.room);
            default:
                return undefined
        }
    }
}


class Low implements IRoomStrategy<HarvestTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        return 100
    }
    generateTargets(): HarvestTargetType[] {
        const f = (source: Source) => {
            const energyAvailable = source.energy > 0
            const canWorkPosLen = source.pos.surroundPos(1).filter(pos => pos.isWalkable()).length
            const targetedLen = source.targetedBy.length

            return energyAvailable && canWorkPosLen * 1.5 - targetedLen > 0
        }

        return this.room.sources.filter(f).sort((a, b) => b.energy - a.energy)
    }
    creepsFilter(creep: Creep): boolean {
        return creep.isEmptyStore && creep.role == "worker" && !creep.spawning
    }
    getAction(): ActionDetail<HarvestTargetType> {
        return {
            actionMethod: SourceAction.harvest,
            shouldSpawn: this.room.creeps('worker', false).length < 20,
        }
    }

}

class Medium implements IRoomStrategy<HarvestTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        throw new Error("Method not implemented.");
    }
    generateTargets(): HarvestTargetType[] {
        throw new Error("Method not implemented.");
    }
    creepsFilter(creep: Creep): boolean {
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

    priority(): number {
        throw new Error("Method not implemented.");
    }
    generateTargets(): HarvestTargetType[] {
        throw new Error("Method not implemented.");
    }
    creepsFilter(creep: Creep): boolean {
        throw new Error("Method not implemented.");
    }
    getAction(): ActionDetail<HarvestTargetType> {
        throw new Error("Method not implemented.");
    }

}
