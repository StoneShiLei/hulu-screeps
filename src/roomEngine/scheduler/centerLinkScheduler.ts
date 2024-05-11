import { TransferTargetType } from "task/instances/task_transfer";
import { Scheduler } from "./scheduler";
import { Action } from "roomEngine/action/action";
import { StorageAction } from "roomEngine/action/storageAction";

export class CenterLinkScheduler extends Scheduler<TransferTargetType> {

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
        const centerLink = this.room.storage?.link
        if (!centerLink || centerLink.store.energy == 0) return []

        //sourceLink有都满的情况下才需要清空centerLink
        let needTran = false
        this.room.sources.forEach(source => {
            const container = source.container
            const link1 = source.links[0]
            const link2 = source.links[1]
            if (!needTran) needTran = !!container && container.store.energy > (link1 && link2 && link1.store.energy == 800 && link2.store.energy == 800 ? 0 : 800)
        })

        if (!needTran || centerLink.targetedBy.length != 0) return []

        return [centerLink];
    }
    getAction(): ActionDetail<TransferTargetType> {
        return {
            actionMethod: StorageAction.tranCenterLink as any,
            options: {
                resourceType: RESOURCE_ENERGY,
                amount: 800
            }
        }
    }

}
