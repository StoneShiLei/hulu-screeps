import { PickupTargetType } from "task/instances/task_pickup";
import { Scheduler } from "./scheduler";
import { WithdrawTargetType } from "task/instances/task_withdraw";
import { DropedAction } from "roomEngine/action/dropedAction";

export const dropedResourceMap: {
    [roomName: string]: (PickupTargetType | WithdrawTargetType)[]
} = {}

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
        if (this.room.hashTime % 9 == 0 || dropedResourceMap[this.room.name] === undefined) {
            this.updateDropedMap(this.room)
        }
        return dropedResourceMap[this.room.name] || []
    }

    getAction(): ActionDetail<PickupTargetType | WithdrawTargetType> {
        return {
            actionMethod: DropedAction.takeDroped,
        }
    }

    /**
     * 更新掉落资源列表
     * @param room
     */
    private updateDropedMap(room: Room): void {
        dropedResourceMap[this.room.name] = dropedResourceMap[this.room.name] || []
        let droped: (PickupTargetType | WithdrawTargetType)[] = []
        droped = droped.concat(room.find(FIND_DROPPED_RESOURCES).filter(x => x.amount > 100))
        droped = droped.concat(room.find(FIND_TOMBSTONES).filter(x => x.store.getUsedCapacity() > 100))
        droped = droped.concat(room.find(FIND_RUINS).filter(x => x.store.getUsedCapacity() > 100))
        dropedResourceMap[this.room.name] = droped
    }

}
