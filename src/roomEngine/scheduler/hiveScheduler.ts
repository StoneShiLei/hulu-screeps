import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/const/const";
import { FillAction } from "roomEngine/action/fillAction";
import { TransferTargetType } from "task/instances/task_transfer";

export class HiveScheduler extends Scheduler<TransferTargetType> {

    constructor(room: Room, role: RoleType) {
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<TransferTargetType> | undefined {
        return new Defaule(this.room)
    }
}


class Defaule implements IRoomStrategy<TransferTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): TransferTargetType[] {
        const targets = [...this.room.spawns, ...this.room.extensions].filter(s => {
            return (s.getCurrentStoreResource(RESOURCE_ENERGY) || 0) < s.store.getCapacity(RESOURCE_ENERGY)
        })
        return targets
    }

    getAction(): ActionDetail<TransferTargetType> {
        return {
            actionMethod: FillAction.fillSpawn,
        }
    }

}
