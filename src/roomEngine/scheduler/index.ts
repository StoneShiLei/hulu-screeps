import { BuildableScheduler } from "./buildableScheduler";
import { ControllerScheduler } from "./controllerScheduler";
import { DropedResourceScheduler } from "./dropedResourceScheduler";
import { InvaderScheduler } from "./invaderScheduler";
import { Scheduler } from "./scheduler";
import { SourceScheduler } from "./sourceScheduler";
import { SpawnScheduler } from "./spawnScheduler";
import { TowerScheduler } from "./towerScheduler";

/**
 * 初始化Scheduler
 * @param room 当前房间
 * @param idleCreeps 当前房间闲置的creep
 * @returns 已按优先级排序的Scheduler列表
 */
export function initScheduler(room: Room, idleCreeps: Creep[]): Scheduler<any>[] {
    const schedulers = [
        new SourceScheduler(room, idleCreeps),
        new SpawnScheduler(room, idleCreeps),
        new ControllerScheduler(room, idleCreeps),
        new BuildableScheduler(room, idleCreeps),
        new DropedResourceScheduler(room, idleCreeps),
        new InvaderScheduler(room, idleCreeps),
        new TowerScheduler(room, idleCreeps),
    ]

    return schedulers.sort((a, b) => b.priority() - a.priority())
}
