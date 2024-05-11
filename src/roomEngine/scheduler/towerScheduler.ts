import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/protos/room"
import { TransferTargetType } from "task/instances/task_transfer";
import { Action } from "roomEngine/action/action";

export class TowerScheduler extends Scheduler<TransferTargetType> {

    constructor(room: Room) {
        const role: RoleType = 'carrier'
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<TransferTargetType> | undefined {
        return new Default(this.room);
    }
}


class Default implements IRoomStrategy<TransferTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): TransferTargetType[] {
        return this.room.towers.filter(tower => {
            return (tower.getCurrentStoreResource(RESOURCE_ENERGY) || 0) < 600
        })
    }

    getAction(): ActionDetail<TransferTargetType> {
        return {
            actionMethod: Action.transferResource,
        }
    }

}
