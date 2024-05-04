import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/const/const";
import { UpgradeAction } from "roomEngine/action/upgradeAction";
import { UpgradeTargetType } from "task/instances/task_upgrade";

export class UpgradeScheduler extends Scheduler<UpgradeTargetType> {

    constructor(room: Room, role: RoleType) {
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<UpgradeTargetType> | undefined {
        switch (this.room.status) {
            case RoomStatusEnum.Low:
                return new Low(this.room)
            case RoomStatusEnum.Medium:
                return new Medium(this.room);
            case RoomStatusEnum.High:
                return new High(this.room);
            default:
                return undefined
        }
    }
}


class Low implements IRoomStrategy<UpgradeTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): UpgradeTargetType[] {
        return this.room.controller ? [this.room.controller] : []
    }

    getAction(): ActionDetail<UpgradeTargetType> {
        return {
            actionMethod: UpgradeAction.upgrade,
        }
    }

}

class Medium implements IRoomStrategy<UpgradeTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): UpgradeTargetType[] {
        return this.room.controller ? [this.room.controller] : []
    }

    getAction(): ActionDetail<UpgradeTargetType> {
        return {
            actionMethod: UpgradeAction.upgrade,
        }
    }

}


class High implements IRoomStrategy<UpgradeTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): UpgradeTargetType[] {
        return this.room.controller ? [this.room.controller] : []
    }

    getAction(): ActionDetail<UpgradeTargetType> {
        return {
            actionMethod: UpgradeAction.upgrade,
        }
    }

}
