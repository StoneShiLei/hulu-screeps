import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/protos/room"
import { InvaderAction } from "roomEngine/action/invaderAction";
import { AttackTargetType } from "task/instances/task_attack";

export class InvaderScheduler extends Scheduler<AttackTargetType> {

    constructor(room: Room) {
        const role: RoleType = 'basicDefender'
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<AttackTargetType> | undefined {
        return new Default(this.room)
    }
}


class Default implements IRoomStrategy<AttackTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): AttackTargetType[] {
        const targets = this.room.find(FIND_HOSTILE_CREEPS).filter(e => e.body.filter(b => b.type != MOVE).length)
        const target = targets.shift()
        return target ? [target] : []
    }

    getAction(): ActionDetail<AttackTargetType> {
        return {
            actionMethod: InvaderAction.basicDefence,
        }
    }

}
