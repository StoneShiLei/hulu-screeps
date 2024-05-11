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
import { StorageScheduler } from "./scheduler/storageScheduler"
import { DropedResourceScheduler } from "./scheduler/dropedResourceScheduler"
import { LOCAL_SHARD_NAME, SIM_ROOM_NAME } from "global"
import { CenterLinkScheduler } from "./scheduler/centerLinkScheduler"
import { BusinessLink } from "structure/instances/business_link"
import { TransferSourceScheduler } from "./scheduler/transferSourceScheduler"
import { FillUpgradeScheduler } from "./scheduler/fillUpgradeScheduler"
import { CarrierBodyConfig } from "role/bodyConfig/carrier"
import { MineralScheduler } from "./scheduler/minetralScheduler"
import { TransferMineralScheduler } from "./scheduler/transferMineralScheduler"
import { BusinessTerminal } from "structure/instances/business_terminal"

export function mountRoomEngine() {
    PrototypeHelper.assignPrototype(Room, RoomExtension)
}

let fistActive = true

export class RoomEngine {
    static run() {

        // ErrorCatcher.catch(() => BusinessTerminal.autoBuy())

        _.values<Room>(Game.rooms).forEach(room => {

            ErrorCatcher.catch(() => BusinessLink.run(room)) //link
            ErrorCatcher.catch(() => BusinessTower.run(room)) //tower

            if (room.hashTime % 3 != 0 || !room.my) return
            if (room.hashTime % 31 == 0) {
                room.update() //更新建筑缓存
            }
            if ((room.hashTime % 301 == 0 || fistActive) && LOCAL_SHARD_NAME != SIM_ROOM_NAME) {
                global.BetterMove.deletePathInRoom(room.name)
                fistActive = false
            }

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


    private static high(room: Room) {

        //carrier工作
        new CenterLinkScheduler(room).tryGenEventToRoom() //整理centerLink
        new HiveScheduler(room, 'carrier').tryGenEventToRoom() //装填hive
        new TowerScheduler(room).tryGenEventToRoom() //装填tower
        new StorageScheduler(room).tryGenEventToRoom() //剩余资源搬运到storage
        new TransferSourceScheduler(room).tryGenEventToRoom() //内矿container搬运
        new TransferMineralScheduler(room).tryGenEventToRoom() //化合物container搬运
        new DropedResourceScheduler(room).tryGenEventToRoom() //搬运掉落资源
        new FillUpgradeScheduler(room).tryGenEventToRoom() //升级container和link搬运

        //worker工作
        new HiveScheduler(room, 'worker').tryGenEventToRoom() //装填hive
        new BuildableScheduler(room).tryGenEventToRoom() //建造工地
        new UpgradeScheduler(room, 'worker').tryGenEventToRoom() //升级

        //spawn
        workerSpawn(room) //生worker
        carrierSpawn(room) //生carrier
        new SourceScheduler(room).tryGenEventToRoom() //专业挖能量
        new MineralScheduler(room).tryGenEventToRoom() //专业挖矿
        new UpgradeScheduler(room, 'upgrader').tryGenEventToRoom() //专业升级


        function carrierSpawn(room: Room) {
            const action = function () {
                room.memory.carrierBusy = room.memory.carrierBusy || []

                const avgBusy = room.memory.carrierBusy.length > 0 ? _.sum(room.memory.carrierBusy) / room.memory.carrierBusy.length : 0;
                const carrierLen = room.creeps('carrier', false).length

                //当没有carrier 且 （storage能量大于3000 或 有harvester） 时，可以生carrier
                const carrier0canSpawn = carrierLen == 0 && ((room.storage?.store[RESOURCE_ENERGY] || 0) > 3000 || room.creeps('sourceHarvester', false).length > 0)
                //如果carrier不到7个，根据繁忙率生carrier
                const canSpawn = carrierLen <= 7 && avgBusy > room.creeps('carrier', false).filter(c => !c.ticksToLive || c.ticksToLive > c.body.length * 3).length * 0.85

                if (carrier0canSpawn || canSpawn) {
                    room.spawnQueue.push({
                        role: 'carrier',
                        bodyFunc: CarrierBodyConfig.carrier
                    })
                }

                //缓存上限130
                if (room.memory.carrierBusy.length > 130) room.memory.carrierBusy = room.memory.carrierBusy.slice(-100)

                const isBusy = room.creeps('carrier').filter(c => c.hasValidTask).reduce((a) => a + 1, 0)
                // console.log(`当前繁忙程度：${avgBusy},本次繁忙：${isBusy},Carrier计数：${room.creeps('carrier', false).filter(c => !c.ticksToLive || c.ticksToLive > c.body.length * 3).length * 0.85}`)
                room.memory.carrierBusy.push(isBusy)
            }

            room.eventQueue.push({
                action: action
            })
        }

        function workerSpawn(room: Room) {
            const action = function () {
                const spawn = function () {
                    room.spawnQueue.push({
                        role: 'worker',
                        bodyFunc: WorkerBodyConfig.mediumWorker,
                    })
                }

                const isEnergyOver = ((room.storage?.store[RESOURCE_ENERGY] || 0) - 150000) / 50000 > room.creeps("worker", false).length
                const noneWorkers = room.creeps('worker', false).length == 0

                //全死光了生一个
                if (room.creeps('worker', false).length + room.creeps('carrier', false).length == 0) {
                    spawn()
                    return
                }
                //有工地,没有worker或能量溢出就生
                if (room.constructionSites.length && (noneWorkers || isEnergyOver)) {
                    spawn()
                    return
                }
                //需要修墙 todo
                // if(needBuildWall){
                // if(room.level<8 && (noWorker|| EnergyOver)){ // 8前 级优先修墙 如果一个都没有就生一个（保证有人去修工地,如果能量够可以多生几个
                //     spawnWorker();
                // }else if(((room.storage.store[RESOURCE_ENERGY]>50000)&&noWorker)||EnergyOver){
                //     if(isSaveCpu)spawnHighLevelWorker();
                //     else spawnWorker();
                // }
                // }
                // //如果能量还是太多了，就拼命修墙
                // if (((room.storage?.store[RESOURCE_ENERGY] || 0) - 300000) / 50000 > room.creeps("worker", false).length) {
                //     spawn();
                // }

            }
            room.eventQueue.push({
                action: action
            })
        }
    }


    private static medium(room: Room) {
        spawnWorker(room) //如果没有搬运资源的,生worker
        new SourceScheduler(room).tryGenEventToRoom() //专业挖能量
        spawnWorker2(room) //全死光了，有工地，生worker
        new UpgradeScheduler(room, 'upgrader').tryGenEventToRoom() //专业升级

        new TransferSourceScheduler(room).tryGenEventToRoom() //内矿container搬运
        new DropedResourceScheduler(room).tryGenEventToRoom() //搬运掉落资源
        spawnCarrier(room) //生carrier
        new HiveScheduler(room, 'carrier').tryGenEventToRoom() //装填hive
        new TowerScheduler(room).tryGenEventToRoom() //装填tower
        new FillUpgradeScheduler(room).tryGenEventToRoom() //升级container和link搬运

        new HiveScheduler(room, 'worker').tryGenEventToRoom() //装填hive
        new BuildableScheduler(room).tryGenEventToRoom() //建造工地
        new UpgradeScheduler(room, 'worker').tryGenEventToRoom() //升级

        function spawnWorker(room: Room) {
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

        function spawnWorker2(room: Room) {
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

        function spawnCarrier(room: Room) {
            const spawnCarrierFunc = function () {
                room.spawnQueue.push({
                    role: 'carrier',
                    bodyFunc: CarrierBodyConfig.carrier,
                })
            }

            if (room.creeps('carrier', false).length == 0 || room.idleCreeps('carrier', false).length == 0) {
                room.eventQueue.push({
                    action: spawnCarrierFunc
                })
            }
        }
    }

    private static low(room: Room) {
        new InvaderScheduler(room).tryGenEventToRoom() //低等级防御
        spawnWorker(room) //矿位有富余时，生worker，上限20
        new HiveScheduler(room, 'worker').tryGenEventToRoom() //装填hive
        new BuildableScheduler(room).tryGenEventToRoom() //建造工地
        new UpgradeScheduler(room, 'worker').tryGenEventToRoom() //升级


        function spawnWorker(room: Room) {
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
    }



}


