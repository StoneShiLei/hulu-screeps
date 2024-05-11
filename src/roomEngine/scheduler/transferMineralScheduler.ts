import { Scheduler } from "./scheduler";
import { WithdrawTargetType } from "task/instances/task_withdraw";
import { Action } from "roomEngine/action/action";
import { WithdrawAllTargetType } from "task/instances/task_withdrawAll";

export class TransferMineralScheduler extends Scheduler<WithdrawAllTargetType> {

    constructor(room: Room) {
        const role: RoleType = 'carrier'
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<WithdrawAllTargetType> | undefined {
        return new Default(this.room);
    }
}

class Default implements IRoomStrategy<WithdrawAllTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): WithdrawAllTargetType[] {
        const container = this.room.extractor?.container
        const type = this.room.mineral?.mineralType
        if (!container || !type) return []
        const currentCount = container.getCurrentStoreResource() || 0

        if (currentCount < 1600 || currentCount <= 2000 && this.room.mineral?.ticksToRegeneration !== undefined) return []

        return [container]
    }
    getAction(): ActionDetail<WithdrawAllTargetType> {
        return {
            actionMethod: Action.withdrawAllResource,
            options: {
                resourceType: RESOURCE_ENERGY
            }
        }
    }

}
