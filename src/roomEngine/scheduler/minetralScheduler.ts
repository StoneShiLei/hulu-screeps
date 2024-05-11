import { MineralAction } from "roomEngine/action/minetralAction";
import { Scheduler } from "./scheduler";
import { MineralHarvestTargetType } from "task/instances/task_mineralHarvest";


export class MineralScheduler extends Scheduler<MineralHarvestTargetType> {

    constructor(room: Room) {
        const role: RoleType = 'minetralHarvester'
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<MineralHarvestTargetType> | undefined {
        return new Default(this.room, this.role);
    }
}

class Default implements IRoomStrategy<MineralHarvestTargetType> {
    room: Room
    role: RoleType

    constructor(room: Room, role: RoleType) {
        this.room = room
        this.role = role
    }

    getTargets(): MineralHarvestTargetType[] {
        //如果没有能运送的则跳过，防止只挖不运
        if (this.room.creeps('carrier', false).length + this.room.creeps('worker', false).length == 0) {
            return []
        }
        if (!this.room.mineral || (this.room.mineral.ticksToRegeneration || 0) > 0 || this.room.mineral.mineralAmount == 0) return []

        if (!this.room.extractor || !this.room.extractor.container || this.room.countResource(this.room.mineral.mineralType) > 100000) return []

        const isCanHarvest = this.room.mineral.targetedBy.filter(c => c.role == this.role).length == 0 ||
            this.room.mineral.targetedBy.filter(c => c.role == this.role && (c.ticksToLive || 1500) < 300).length > 0 &&
            this.room.mineral.targetedBy.filter(c => c.role == this.role && (c.ticksToLive || 1500) > 300).length == 0

        return isCanHarvest ? [this.room.mineral] : []
    }
    getAction(): ActionDetail<MineralHarvestTargetType> {
        return {
            actionMethod: MineralAction.constantHarvest,
            options: {
                resourceType: RESOURCE_ENERGY
            }
        }
    }

}
