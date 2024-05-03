import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/const/const";
import { ControllerStrategy } from "roomEngine/strategy/controllerStrategy";
import { UpgradeTargetType } from "task/instances/task_upgrade";

export class ControllerScheduler extends Scheduler<UpgradeTargetType> {

    constructor(room: Room, idleCreeps: Creep[]) {
        super(room, idleCreeps)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<UpgradeTargetType> | undefined {
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


class Low implements IRoomStrategy<UpgradeTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        return 10
    }
    generateTargets(): UpgradeTargetType[] {
        return this.room.controller ? [this.room.controller] : []
    }
    creepsFilter(creep: Creep): boolean {
        return !creep.isEmptyStore && creep.role == "worker" && !creep.spawning
    }
    getStrategy(): StrategyDetail<UpgradeTargetType> {
        return {
            strategyMethod: ControllerStrategy.upgrade,
            creepsPerTarget: 999,
            shouldSpawn: false,
        }
    }

}

class Medium implements IRoomStrategy<UpgradeTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        throw new Error("Method not implemented.");
    }
    generateTargets(): UpgradeTargetType[] {
        throw new Error("Method not implemented.");
    }
    creepsFilter(creep: Creep): boolean {
        throw new Error("Method not implemented.");
    }
    getStrategy(): StrategyDetail<UpgradeTargetType> {
        throw new Error("Method not implemented.");
    }

}


class High implements IRoomStrategy<UpgradeTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        throw new Error("Method not implemented.");
    }
    generateTargets(): UpgradeTargetType[] {
        throw new Error("Method not implemented.");
    }
    creepsFilter(creep: Creep): boolean {
        throw new Error("Method not implemented.");
    }
    getStrategy(): StrategyDetail<UpgradeTargetType> {
        throw new Error("Method not implemented.");
    }

}
