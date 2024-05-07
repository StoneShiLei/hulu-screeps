import { Scheduler } from "./scheduler";
import { TransferTargetType } from "task/instances/task_transfer";
import { StorageAction } from "roomEngine/action/storageAction";

export class StorageScheduler extends Scheduler<TransferTargetType> {

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
        return this.room.storage ? [this.room.storage] : []
    }

    getAction(): ActionDetail<TransferTargetType> {
        return {
            actionMethod: StorageAction.fillAllResourceToStorage,
        }
    }

}
