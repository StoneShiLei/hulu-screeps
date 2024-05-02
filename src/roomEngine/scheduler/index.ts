import { Scheduler } from "./scheduler";
import { SourceScheduler } from "./sourceScheduler";

/**
 * 初始化Scheduler
 * @param room 当前房间
 * @param idleCreeps 当前房间闲置的creep
 * @returns 已按优先级排序的Scheduler列表
 */
export function initScheduler(room: Room, idleCreeps: Creep[]): Scheduler<any>[] {
    const schedulers = [
        new SourceScheduler(room, idleCreeps),
    ]

    return schedulers.sort((a, b) => b.priority() - a.priority())
}
