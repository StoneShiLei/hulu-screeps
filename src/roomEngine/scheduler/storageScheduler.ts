import { TransferAllTargetType } from "task/instances/task_transferAll";
import { Scheduler } from "./scheduler";
import { StorageAction } from "roomEngine/action/storageAction";

export class StorageScheduler extends Scheduler<TransferAllTargetType> {

    constructor(room: Room) {
        const role: RoleType = 'carrier'
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<TransferAllTargetType> | undefined {
        return new Default(this.room);
    }
}


class Default implements IRoomStrategy<TransferAllTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): TransferAllTargetType[] {
        return this.room.storage ? [this.room.storage] : []
    }

    getAction(): ActionDetail<TransferAllTargetType> {
        return {
            actionMethod: StorageAction.fillAllResourceToStorage,
        }
    }

}
