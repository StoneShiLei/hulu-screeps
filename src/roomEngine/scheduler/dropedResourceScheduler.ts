import { PickupTargetType } from "task/instances/task_pickup";
import { Scheduler } from "./scheduler";
import { WithdrawTargetType } from "task/instances/task_withdraw";
import { DropedAction } from "roomEngine/action/dropedAction";

export class DropedResourceScheduler extends Scheduler<PickupTargetType | WithdrawTargetType> {

    constructor(room: Room) {
        const role = 'carrier'
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<PickupTargetType | WithdrawTargetType> | undefined {
        return new Default(this.room)
    }
}


class Default implements IRoomStrategy<PickupTargetType | WithdrawTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): (PickupTargetType | WithdrawTargetType)[] {
        return this.room.drops.filter(d => {
            if ('store' in d) {
                return d.store.getUsedCapacity() > 100
            }
            else {
                return d.amount > 100
            }
        })
    }

    getAction(): ActionDetail<PickupTargetType | WithdrawTargetType> {
        return {
            actionMethod: DropedAction.takeDroped,
        }
    }

}
