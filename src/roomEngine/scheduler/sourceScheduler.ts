import { Scheduler } from "./scheduler";
import { SourceAction } from "roomEngine/action/sourceAction";
import { RoomStatusEnum } from "global/const/const";
import { SourceConstantHarvestTargetType } from "task/instances/task_sourceConstantHarvest";
import { WithdrawTargetType } from "task/instances/task_withdraw";
import { Action } from "roomEngine/action/action";

export class SourceScheduler extends Scheduler<SourceConstantHarvestTargetType | WithdrawTargetType> {

    constructor(room: Room, role: RoleType) {
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<SourceConstantHarvestTargetType | WithdrawTargetType> | undefined {
        return new Default(this.room, this.role);
    }
}

class Default implements IRoomStrategy<SourceConstantHarvestTargetType | WithdrawTargetType> {
    room: Room
    role: RoleType

    constructor(room: Room, role: RoleType) {
        this.room = room
        this.role = role
    }

    getTargets(): (SourceConstantHarvestTargetType | WithdrawTargetType)[] {

        if (this.role == 'sourceConstantHarvester') {
            //如果没有能运送的则跳过，防止只挖不运
            if (this.room.creeps('carrier', false).length + this.room.creeps('worker').length == 0) {
                return []
            }

            const targets = this.room.sources.filter(s =>
                s.targetedBy.filter(c => c.role == this.role).length == 0 ||
                s.targetedBy.filter(c => c.role == this.role && (c.ticksToLive || 1500) < 300).length > 0)

            return targets
        }
        else if (this.role == 'carrier') {
            const containers = this.room.sources.map(s => s.container).filter((c): c is StructureContainer => c !== undefined)
            const targets = containers.filter(c => (c.getCurrentStoreResource(RESOURCE_ENERGY) || 0) > (this.room.level == 8 ? 1600 : 1200))
            return targets
        }
        else {
            return []
        }
    }
    getAction(): ActionDetail<SourceConstantHarvestTargetType | WithdrawTargetType> {
        let action: any
        switch (this.role) {
            case 'sourceConstantHarvester':
                action = SourceAction.constantHarvest
                break
            case 'carrier':
                action = SourceAction.withdrawSourceContainer
                break
            default:
                throw Error(`UpgradeScheduler的${this.room.status}策略未实现${this.role}的action方法`)
        }
        return {
            actionMethod: action,
            options: {
                resourceType: RESOURCE_ENERGY
            }
        }
    }

}
