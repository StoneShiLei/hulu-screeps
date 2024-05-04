import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/const/const";
import { InvaderAction } from "roomEngine/action/invaderAction";
import { AttackTargetType } from "task/instances/task_attack";

export class InvaderScheduler extends Scheduler<AttackTargetType> {

    constructor(room: Room, idleCreeps: Creep[]) {
        super(room, idleCreeps)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<AttackTargetType> | undefined {
        switch (this.room.status) {
            case RoomStatusEnum.Low:
                return new DefaultStrategy(this.room)
            case RoomStatusEnum.Medium:
                return new DefaultStrategy(this.room);
            default:
                return undefined
        }
    }
}


class DefaultStrategy implements IRoomStrategy<AttackTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        return 1000
    }
    generateTargets(): AttackTargetType[] {
        const targets = this.room.find(FIND_HOSTILE_CREEPS).filter(e => e.body.filter(b => b.type != MOVE).length)
        const target = targets.shift()
        return target ? [target] : []
    }
    creepsFilter(creep: Creep): boolean {
        return creep.role == "basicDefender"
    }
    getAction(): ActionDetail<AttackTargetType> {
        return {
            actionMethod: InvaderAction.basicDefence,
            creepsPerTarget: 3,
            shouldSpawn: this.room.towers.length == 0 && this.room.creeps("basicDefender", false).length < 3,
        }
    }

}
