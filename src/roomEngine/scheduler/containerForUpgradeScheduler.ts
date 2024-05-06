import { TransferTargetType } from "task/instances/task_transfer";
import { Scheduler } from "./scheduler";
import { Action } from "roomEngine/action/action";

export class ContainerForUpgradeScheduler extends Scheduler<TransferTargetType> {

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
        if (!this.room.controller) return []
        const container = this.room.controller.container
        if (!container) return []

        //有link时 检查link+container总容量是否小于800 或者link为空  todo
        if ((container.getCurrentStoreResource(RESOURCE_ENERGY) || 0) > 1200) return []

        return [container]
    }
    getAction(): ActionDetail<TransferTargetType> {
        return {
            actionMethod: Action.transferResource,
            options: {
                resourceType: RESOURCE_ENERGY
            }
        }
    }

}
