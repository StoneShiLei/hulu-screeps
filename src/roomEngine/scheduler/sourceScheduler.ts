import { HarvestTargetType } from "task/instances/task_harvest-constant";
import { Scheduler } from "./scheduler";

export class SourceScheduler extends Scheduler<HarvestTargetType> {


    constructor(room: Room, idleCreeps: Creep[]) {
        super(room, idleCreeps)
    }

    priority(): number {
        if (this.room.status == RoomStatusEnum.Low) {
            return 100
        }
        else if (this.room.status == RoomStatusEnum.Medium) {
            return 200
        }
        else if (this.room.status == RoomStatusEnum.High) {
            return 300
        }
        else {
            return 100
        }
    }

    generateTargets(): HarvestTargetType[] {
        if (this.room.status == RoomStatusEnum.Low) {

        }
        else if (this.room.status == RoomStatusEnum.Medium) {

        }
        else if (this.room.status == RoomStatusEnum.High) {

        }
        else {

        }
    }
    creepsFilter(creep: Creep): boolean {
        return creep.isEmptyStore
    }
    getStrategy(): StrategyDetail {
        if (this.room.status == RoomStatusEnum.Low) {

        }
        else if (this.room.status == RoomStatusEnum.Medium) {

        }
        else if (this.room.status == RoomStatusEnum.High) {

        }
        else {

        }
    }

}
