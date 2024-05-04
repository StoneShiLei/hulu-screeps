import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/const/const";
import { BuildableAction } from "roomEngine/action/buildableAction";
import { BuildTargetType } from "task/instances/task_build";

export class BuildableScheduler extends Scheduler<BuildTargetType> {

    constructor(room: Room, idleCreeps: Creep[]) {
        super(room, idleCreeps)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<BuildTargetType> | undefined {
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


class Low implements IRoomStrategy<BuildTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        return 30
    }
    generateTargets(): BuildTargetType[] {
        return this.room.level > 1 && this.room.constructionSites.length ? [this.room.constructionSites[0]] : []
    }
    creepsFilter(creep: Creep): boolean {
        return !creep.isEmptyStore && creep.role == "worker" && !creep.spawning
    }
    getAction(): ActionDetail<BuildTargetType> {
        return {
            actionMethod: BuildableAction.build,
            creepsPerTarget: 999,
            shouldSpawn: false,
        }
    }

}

class Medium implements IRoomStrategy<BuildTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        throw new Error("Method not implemented.");
    }
    generateTargets(): BuildTargetType[] {
        throw new Error("Method not implemented.");
    }
    creepsFilter(creep: Creep): boolean {
        throw new Error("Method not implemented.");
    }
    getAction(): ActionDetail<BuildTargetType> {
        throw new Error("Method not implemented.");
    }

}


class High implements IRoomStrategy<BuildTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        throw new Error("Method not implemented.");
    }
    generateTargets(): BuildTargetType[] {
        throw new Error("Method not implemented.");
    }
    creepsFilter(creep: Creep): boolean {
        throw new Error("Method not implemented.");
    }
    getAction(): ActionDetail<BuildTargetType> {
        throw new Error("Method not implemented.");
    }

}
