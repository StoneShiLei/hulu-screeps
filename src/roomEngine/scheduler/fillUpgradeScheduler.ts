import { TransferTargetType } from "task/instances/task_transfer";
import { Scheduler } from "./scheduler";
import { Action } from "roomEngine/action/action";

export class FillUpgradeScheduler extends Scheduler<TransferTargetType> {

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

        const link = this.room.controller.link
        const centerLink = this.room.storage?.link
        //如果有link在，且2个link都为空，则装填中央link
        if (link && centerLink && link.store.energy == 0 && centerLink.store.energy == 0) {
            return [centerLink]
        }

        // 获取container中的能量存储量
        const containerEnergy = container.getCurrentStoreResource(RESOURCE_ENERGY) || 0;
        if (link) {
            // 有link时，检查link的能量是否为0且container的能量小于800
            if (link.store.energy === 0 && containerEnergy < 800) {
                return [container];
            }
        } else {
            // 没有link时，检查container的能量是否小于1200
            if (containerEnergy < 1200) {
                return [container];
            }
        }

        // 如果不满足上述任何条件，则不发布任务
        return [];
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
