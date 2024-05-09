import { Scheduler } from "./scheduler";
import { WithdrawTargetType } from "task/instances/task_withdraw";
import { ContainerAction } from "roomEngine/action/containerAction";

export class TransferSourceScheduler extends Scheduler<WithdrawTargetType> {

    constructor(room: Room) {
        const role: RoleType = 'carrier'
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<WithdrawTargetType> | undefined {
        return new Default(this.room);
    }
}

class Default implements IRoomStrategy<WithdrawTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): WithdrawTargetType[] {
        const containers = this.room.sources.map(s => s.container).filter((c): c is StructureContainer => c !== undefined)
        const targets = containers.filter(c => (c.getCurrentStoreResource(RESOURCE_ENERGY) || 0) > (this.room.level == 8 ? 1600 : 1200))
        return targets
    }
    getAction(): ActionDetail<WithdrawTargetType> {
        return {
            actionMethod: ContainerAction.withdrawSourceContainer,
            options: {
                resourceType: RESOURCE_ENERGY
            }
        }
    }

}
