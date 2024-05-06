import { ErrorCatcher } from "utils/ErrorCatcher"
import { BusinessTower } from "structure/instances/business_tower"
import { PrototypeHelper } from "utils/PrototypeHelper"
import { RoomExtension } from "./protos/room"
import { InvaderScheduler } from "./scheduler/invaderScheduler"
import { HiveScheduler } from "./scheduler/hiveScheduler"
import { TowerScheduler } from "./scheduler/towerScheduler"
import { BuildableScheduler } from "./scheduler/buildableScheduler"
import { UpgradeScheduler } from "./scheduler/upgradeScheduler"
import { RoomStatusEnum } from "global/protos/room"
import { WorkerBodyConfig } from "role/bodyConfig/worker"
import { SourceScheduler } from "./scheduler/sourceScheduler"
import { worker } from "cluster"
import { StorageScheduler } from "./scheduler/storageScheduler"

export function mountRoomEngine() {
    PrototypeHelper.assignPrototype(Room, RoomExtension)
}

export class RoomEngine {
    static run() {
        _.values<Room>(Game.rooms).forEach(room => {

            ErrorCatcher.catch(() => BusinessTower.run(room)) //tower

            if (room.hashTime % 3 != 0 || !room.my) return
            if (room.hashTime % 31) room.update()

            //按房间状态选用策略
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

            //处理房间事件队列
            room.eventQueue.forEach(event => event.action())

            //处理房间spawn队列
            room.spawnQueue.forEach(request => {
                room.trySpawn(request.role, request.bodyFunc, request.task, request.spawnOpt, request.targetRoomName)
            })
        })
    }

    private static low(room: Room) {
        new InvaderScheduler(room).tryGenEventToRoom() //低等级防御
        this.lowSpawnWorker(room) //spawn worker
        new HiveScheduler(room, 'worker').tryGenEventToRoom() //装填hive
        new BuildableScheduler(room, 'worker').tryGenEventToRoom() //建造工地
        new UpgradeScheduler(room, 'worker').tryGenEventToRoom() //升级
    }

    private static medium(room: Room) {
        this.checkNonCarry(room) //如果没有可搬运资源的creep则spawn一个
        new SourceScheduler(room, 'sourceConstantHarvester').tryGenEventToRoom() //专业挖能量
        this.checkAllDead(room) //检测是否全死光了
        new UpgradeScheduler(room, 'upgrader').tryGenEventToRoom() //专业升级
        new SourceScheduler(room, 'carrier').tryGenEventToRoom() //搬运内矿

        new HiveScheduler(room, 'carrier').tryGenEventToRoom() //装填hive
        new TowerScheduler(room, 'carrier').tryGenEventToRoom() //装填tower
        new UpgradeScheduler(room, 'carrier').tryGenEventToRoom() //升级容器搬运

        new HiveScheduler(room, 'worker').tryGenEventToRoom() //装填hive
        new BuildableScheduler(room, 'worker').tryGenEventToRoom() //建造工地
        new UpgradeScheduler(room, 'worker').tryGenEventToRoom() //升级

    }

    private static high(room: Room) {
        this.checkNonCarry(room) //如果没有可搬运资源的creep则spawn一个
        new SourceScheduler(room, 'sourceConstantHarvester').tryGenEventToRoom() //专业挖能量
        this.checkAllDead(room) //检测是否全死光了
        new UpgradeScheduler(room, 'upgrader').tryGenEventToRoom() //专业升级
        new SourceScheduler(room, 'carrier').tryGenEventToRoom() //搬运内矿

        new HiveScheduler(room, 'carrier').tryGenEventToRoom() //装填hive
        new TowerScheduler(room, 'carrier').tryGenEventToRoom() //装填tower
        new UpgradeScheduler(room, 'carrier').tryGenEventToRoom() //升级容器搬运
        new StorageScheduler(room, 'carrier').tryGenEventToRoom() //剩余资源搬运到storage

        new HiveScheduler(room, 'worker').tryGenEventToRoom() //装填hive
        new BuildableScheduler(room, 'worker').tryGenEventToRoom() //建造工地
        new UpgradeScheduler(room, 'worker').tryGenEventToRoom() //升级
    }

    private static lowSpawnWorker(room: Room) {
        if (room.creeps('worker', false).length < 20 &&
            room.sources.filter(s => s.canHarvest).length > 0) {
            room.eventQueue.push({
                action: () => room.spawnQueue.push({
                    role: 'worker',
                    bodyFunc: WorkerBodyConfig.lowWorker,
                })
            })
        }
    }

    private static checkNonCarry(room: Room) {
        const spawnWorkerFunc = function () {
            room.spawnQueue.push({
                role: 'worker',
                bodyFunc: WorkerBodyConfig.mediumWorker,
            })
        }

        if (room.creeps('worker', false).length + room.creeps('carrier').length == 0) {
            room.eventQueue.push({
                action: spawnWorkerFunc
            })
        }
    }

    private static checkAllDead(room: Room) {
        const spawnWorkerFunc = function () {
            room.spawnQueue.push({
                role: 'worker',
                bodyFunc: WorkerBodyConfig.mediumWorker,
            })
        }

        //（有工地 || 全死光） && （工人小于2 || 闲置搬运大于闲置工人且工人小于2）
        const isHasConstructionSite = room.constructionSites.length > 0
        const isAllDead = room.creeps(undefined, false).length == 0
        const carrierGTworker = room.idleCreeps('carrier').length > room.idleCreeps('worker').length && room.idleCreeps('worker', false).length < 2
        if ((isHasConstructionSite || isAllDead) && (room.creeps('worker').length < 2 || carrierGTworker)) {
            room.eventQueue.push({
                action: spawnWorkerFunc
            })
        }
    }
}


