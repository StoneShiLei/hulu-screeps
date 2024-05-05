import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/const/const";
import { TransferTargetType } from "task/instances/task_transfer";
import { Action } from "roomEngine/action/action";

export class StorageScheduler extends Scheduler<TransferTargetType> {

    constructor(room: Room, role: RoleType) {
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
        return this.room.storage ? [this.room.storage] : []
    }

    getAction(): ActionDetail<TransferTargetType> {
        return {
            actionMethod: Action.transferAllResource,
        }
    }

}
