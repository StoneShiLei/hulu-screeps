import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/const/const";
import { TransferTargetType } from "task/instances/task_transfer";
import { FillStrategy } from "roomEngine/strategy/fillStrategy";

export class TowerScheduler extends Scheduler<TransferTargetType> {

    constructor(room: Room, idleCreeps: Creep[]) {
        super(room, idleCreeps)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<TransferTargetType> | undefined {
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


class Low implements IRoomStrategy<TransferTargetType> { //todo
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        return 50 //todo
    }
    generateTargets(): TransferTargetType[] {
        return this.room.towers.filter(tower => {
            //统计以tower为目标运送的能量总量
            const sendingCount = tower.targetedBy.reduce((energy, creep) => energy + creep.store[RESOURCE_ENERGY] || 0, 0)
            return sendingCount + tower.store[RESOURCE_ENERGY] < 600
        })
    }
    creepsFilter(creep: Creep): boolean {
        return !creep.isEmptyStore && creep.role == "worker" && !creep.spawning //todo
    }
    getStrategy(): StrategyDetail<TransferTargetType> {
        return {
            strategyMethod: FillStrategy.fillTower,
            shouldSpawn: false
        }
    }

}

class Medium implements IRoomStrategy<TransferTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        throw new Error("Method not implemented.");
    }
    generateTargets(): TransferTargetType[] {
        throw new Error("Method not implemented.");
    }
    creepsFilter(creep: Creep): boolean {
        throw new Error("Method not implemented.");
    }
    getStrategy(): StrategyDetail<TransferTargetType> {
        throw new Error("Method not implemented.");
    }

}


class High implements IRoomStrategy<TransferTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        throw new Error("Method not implemented.");
    }
    generateTargets(): TransferTargetType[] {
        throw new Error("Method not implemented.");
    }
    creepsFilter(creep: Creep): boolean {
        throw new Error("Method not implemented.");
    }
    getStrategy(): StrategyDetail<TransferTargetType> {
        throw new Error("Method not implemented.");
    }

}
