import { ErrorCatcher } from "utils/ErrorCatcher"
import { BusinessTower } from "structure/instances/business_tower"
import { PrototypeHelper } from "utils/PrototypeHelper"
import { RoomExtension } from "./protos/room"
import { InvaderScheduler } from "./scheduler/invaderScheduler"
import { HiveScheduler } from "./scheduler/hiveScheduler"
import { TowerScheduler } from "./scheduler/towerScheduler"
import { BuildableScheduler } from "./scheduler/buildableScheduler"
import { UpgradeScheduler } from "./scheduler/upgradeScheduler"
import { RoomStatusEnum } from "global/const/const"
import { WorkerBodyConfig } from "role/bodyConfig/worker"
import { SourceScheduler } from "./scheduler/sourceScheduler"

export function mountRoomEngine() {
    PrototypeHelper.assignPrototype(Room, RoomExtension)
}

export class RoomEngine {
    static run() {
        _.values<Room>(Game.rooms).forEach(room => {

            ErrorCatcher.catch(() => BusinessTower.run(room))



            if (room.hashTime % 3 != 0 || !room.my) return
            if (room.hashTime % 31) room.update()

            switch (room.status) {
                case RoomStatusEnum.Low:
                    RoomEngine.low(room)
                    break;
                case RoomStatusEnum.Medium:
                    RoomEngine.medium(room)
                    break;
                case RoomStatusEnum.High:
                    RoomEngine.high(room)
                    break;
                default:
                    break;
            }

            //处理事件队列
            room.eventQueue.forEach(event => event.action())

            //处理spawn队列
            room.spawnQueue.forEach(request => {
                room.trySpawn(request.role, request.bodyFunc, request.task, request.spawnOpt, request.targetRoomName)
            })
        })
    }

    private static low(room: Room) {
        new InvaderScheduler(room).tryGenEventToRoom()
        new HiveScheduler(room, 'worker').tryGenEventToRoom()
        new BuildableScheduler(room, 'worker').tryGenEventToRoom()
        new UpgradeScheduler(room, 'worker').tryGenEventToRoom()


        if (room.creeps('worker', false).length < 20 &&
            room.sources.filter(s => s.canHarvest).length > 0) {
            room.spawnQueue.push({
                role: 'worker',
                bodyFunc: WorkerBodyConfig.lowWorker,
            })
        }
    }

    private static medium(room: Room) {
        new SourceScheduler(room).tryGenEventToRoom()

        new HiveScheduler(room, 'worker').tryGenEventToRoom()
        new TowerScheduler(room, 'worker').tryGenEventToRoom()
        new BuildableScheduler(room, 'worker').tryGenEventToRoom()
        new UpgradeScheduler(room, 'worker').tryGenEventToRoom() //专业升级的

        debugger
        //（有工地 || 全死光） && （工人小于2 || 闲置搬运大于闲置工人且工人小于2）
        const isHasConstructionSite = room.constructionSites.length > 0
        const isAllDead = room.creeps(undefined, false).length == 0
        const carrierGTworker = room.idleCreeps('carrier').length > room.idleCreeps('worker').length && room.idleCreeps('worker', false).length < 2

        if ((isHasConstructionSite || isAllDead) && (room.creeps('worker').length < 2 || carrierGTworker)) {
            room.spawnQueue.push({
                role: 'worker',
                bodyFunc: WorkerBodyConfig.mediumWorker,
            })
        }
    }

    private static high(room: Room) {

    }
}


