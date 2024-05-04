import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/const/const";
import { TransferTargetType } from "task/instances/task_transfer";
import { FillAction } from "roomEngine/action/fillAction";

export class TowerScheduler extends Scheduler<TransferTargetType> {

    constructor(room: Room, role: RoleType) {
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<TransferTargetType> | undefined {
        return new Default(this.room);
    }
}


class Default implements IRoomStrategy<TransferTargetType> { //todo
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
            actionMethod: FillAction.fillTower,
        }
    }

}
