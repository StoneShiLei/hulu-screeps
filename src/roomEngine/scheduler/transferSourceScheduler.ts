import { Scheduler } from "./scheduler";
import { WithdrawTargetType } from "task/instances/task_withdraw";
import { Action } from "roomEngine/action/action";

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

        //必须有harvester且link少于6的时候才发布任务
        if (this.room.level == 8 && (!this.room.creeps('sourceHarvester').length || this.room.links.length == 6)) return []

        const containers = this.room.sources.map(s => s.container).filter((c): c is StructureContainer => c !== undefined)
        const targets = containers.filter(c => (c.getCurrentStoreResource(RESOURCE_ENERGY) || 0) > (this.room.level == 8 ? 1600 : 1200))
        return targets
    }
    getAction(): ActionDetail<WithdrawTargetType> {
        return {
            actionMethod: Action.withdrawResource,
            options: {
                resourceType: RESOURCE_ENERGY
            }
        }
    }

}
