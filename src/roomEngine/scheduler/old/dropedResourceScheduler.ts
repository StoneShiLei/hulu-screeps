import { PickupTargetType } from "task/instances/task_pickup";
import { Scheduler } from "../scheduler";
import { RoomStatusEnum } from "global/const/const";
import { WithdrawTargetType } from "task/instances/task_withdraw";

const dropedResourceMap: {
    [roomName: string]: (PickupTargetType | WithdrawTargetType)[]
} = {}

export class DropedResourceScheduler extends Scheduler<PickupTargetType | WithdrawTargetType> {

    constructor(room: Room, role: RoleType) {
        super(room, role)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<PickupTargetType | WithdrawTargetType> | undefined {
        // switch (this.room.status) {
        //     case RoomStatusEnum.Low:
        //         return new Low(this.room)
        //     case RoomStatusEnum.Medium:
        //         return new Medium(this.room);
        //     case RoomStatusEnum.High:
        //         return new High(this.room);
        //     default:
        //         return undefined
        // }
        return undefined
    }
}


// class Low implements IRoomStrategy<PickupTargetType | WithdrawTargetType> {
//     room: Room

//     constructor(room: Room) {
//         this.room = room
//     }

//     getTargets(): (PickupTargetType | WithdrawTargetType)[] {
//         dropedResourceMap[this.room.name] = dropedResourceMap[this.room.name] || []
//         if (this.room.hashTime % 9 == 0) {
//             let droped: (PickupTargetType | WithdrawTargetType)[] = []
//             droped = droped.concat(this.room.find(FIND_DROPPED_RESOURCES).filter(x => x.amount > 100))
//             droped = droped.concat(this.room.find(FIND_TOMBSTONES).filter(x => x.store.energy > 100))
//             droped = droped.concat(this.room.find(FIND_RUINS).filter(x => x.store.energy > 100))
//             dropedResourceMap[this.room.name] = droped
//         }
//         const target = dropedResourceMap[this.room.name].shift()
//         return target ? [target] : []
//     }

//     getAction(): ActionDetail<PickupTargetType | WithdrawTargetType> {
//         return {
//             actionMethod: .takeDroped,
//         }
//     }

// }

class Medium implements IRoomStrategy<PickupTargetType | WithdrawTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): (PickupTargetType | WithdrawTargetType)[] {
        throw new Error("Method not implemented.");
    }

    getAction(): ActionDetail<PickupTargetType | WithdrawTargetType> {
        throw new Error("Method not implemented.");
    }

}


class High implements IRoomStrategy<PickupTargetType | WithdrawTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    getTargets(): (PickupTargetType | WithdrawTargetType)[] {
        throw new Error("Method not implemented.");
    }

    getAction(): ActionDetail<PickupTargetType | WithdrawTargetType> {
        throw new Error("Method not implemented.");
    }

}
