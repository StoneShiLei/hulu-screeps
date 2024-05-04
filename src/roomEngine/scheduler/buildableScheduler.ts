import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/const/const";
import { BuildableAction } from "roomEngine/action/buildableAction";
import { BuildTargetType } from "task/instances/task_build";

export class BuildableScheduler extends Scheduler<BuildTargetType> {

    constructor(room: Room, role: RoleType) {
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<BuildTargetType> | undefined {
        return new Default(this.room)
    }
}


class Default implements IRoomStrategy<BuildTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): BuildTargetType[] {
        return this.room.level > 1 && this.room.constructionSites.length ? [this.room.constructionSites[0]] : []
    }

    getAction(): ActionDetail<BuildTargetType> {
        return {
            actionMethod: BuildableAction.build,
        }
    }

}
