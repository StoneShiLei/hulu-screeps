import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { TransferTargetType } from "task/instances/task_transfer";

function sortTargetsByDistance(startPos: RoomPosition, targets: TransferTargetType[]): TransferTargetType[] {
    const unsortTargets = targets

    let result: TransferTargetType[] = [];
    let currentPos = startPos;

    while (unsortTargets.length > 0) {
        let nextTarget = currentPos.findClosestByPath(unsortTargets, { ignoreCreeps: true });
        if (nextTarget) {
            result.push(nextTarget);
            // 将当前位置更新为刚找到的最近位置
            currentPos = nextTarget.pos;
            // 从待排序数组中移除已经添加到结果中的目标
            _.remove(unsortTargets, target => target === nextTarget);
        } else {
            // 如果没有找到下一个位置（例如由于路径不可达），则跳出循环
            break;
        }
    }
    return result
}

export class HiveAction extends Action {

    static fillSpawn(targets: TransferTargetType[], role: RoleType, room: Room) {
        return function () {
            const creeps = room.idleCreeps(role, false)

            creeps.forEach(creep => {

                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {

                    const resources = Action.findResource(creep.room, RESOURCE_ENERGY, creep.getActiveBodyparts(WORK) == 0)
                    const target = creep.pos.findClosestByPath(resources, { ignoreCreeps: true })
                    if (!target && creep.isEmptyStore) return //emptyStore且找不到获取资源的目标时 不执行任何任务
                    if (target) {
                        const sortedTargets = sortTargetsByDistance(target.pos, targets)

                        let capacity = creep.store.getCapacity(RESOURCE_ENERGY)
                        const fillTasks: ITask[] = []
                        while (capacity > 0) {
                            const target = sortedTargets.shift()
                            if (!target) break
                            fillTasks.push(TaskHelper.transfer(target))
                            capacity -= target.store.getCapacity(RESOURCE_ENERGY)
                        }
                        if (!fillTasks.length) return
                        creep.task = TaskHelper.chain([Action.genTakeResourceTask(target), ...fillTasks])
                    }
                }

                const sortedTargets = sortTargetsByDistance(creep.pos, targets)
                let capacity = creep.store.getCapacity(RESOURCE_ENERGY)
                const fillTasks: ITask[] = []
                while (capacity > 0) {
                    const target = sortedTargets.shift()
                    if (!target) break
                    fillTasks.push(TaskHelper.transfer(target))
                    capacity -= target.store.getCapacity(RESOURCE_ENERGY)
                }
                if (!fillTasks.length) return
                creep.task = TaskHelper.chain(fillTasks)
            })
        }
    }
}


// /**
//  * 计算两点之间的直线距离（不考虑地形）
//  * @param pos1 第一个位置
//  * @param pos2 第二个位置
//  * @returns 直线距离
//  */
// function calculateDistance(pos1: RoomPosition, pos2: RoomPosition): number {
//     return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
// }

// function sortExtensionsByDistance(creep: Creep, targets: TransferTargetType[]): TransferTargetType[] {
//     return targets.sort((a, b) => {
//         const distA = calculateDistance(creep.pos, a.pos);
//         const distB = calculateDistance(creep.pos, b.pos);
//         return distA - distB;
//     });
// }

// export class HiveAction extends Action {

//     static fillSpawn(targets: TransferTargetType[], role: RoleType, room: Room) {
//         return function () {
//             const creeps = room.idleCreeps(role, false)

//             creeps.forEach(creep => {

//                 targets = sortExtensionsByDistance(creep, targets)

//                 let capacity = creep.store.getCapacity(RESOURCE_ENERGY)

//                 const fillTasks: ITask[] = []
//                 while (capacity > 0) {
//                     const target = targets.shift()
//                     if (!target) break
//                     fillTasks.push(TaskHelper.transfer(target))
//                     capacity -= target.store.getCapacity(RESOURCE_ENERGY)
//                 }
//                 if (!fillTasks.length) return
//                 const tasks = Action.genTaskList(creep, RESOURCE_ENERGY, ...fillTasks)
//                 creep.task = TaskHelper.chain(tasks)
//             })
//         }
//     }
// }
