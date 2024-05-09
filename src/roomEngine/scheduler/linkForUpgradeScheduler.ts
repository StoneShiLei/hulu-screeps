import { TransferTargetType } from "task/instances/task_transfer";
import { Scheduler } from "./scheduler";
import { Action } from "roomEngine/action/action";

export class LinkForUpgradeScheduler extends Scheduler<TransferTargetType> {

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
        const link = this.room.controller.link
        const centerLink = this.room.storage?.link
        //如果有link在，且2个link都为空，则装填中央link
        if (link && centerLink && link.store.energy == 0 && centerLink.store.energy == 0) {
            return [centerLink]
        }

        return [];
    }
    getAction(): ActionDetail<TransferTargetType> {
        return {
            actionMethod: Action.transferResource,
            options: {
                resourceType: RESOURCE_ENERGY,
                amount: 800
            }
        }
    }

}
