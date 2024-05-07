import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { TransferTargetType } from "task/instances/task_transfer";

export class HiveAction extends Action {

    static fillSpawn(targets: TransferTargetType[], role: RoleType, room: Room) {
        return function () {
            const creeps = room.idleCreeps(role, false)

            creeps.forEach(creep => {

                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {

                    const resources = Action.findResource(creep, RESOURCE_ENERGY)
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
                        return
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
                return
            })
        }
    }
}

/**
 * 计算两点之间欧几里得距离
 * @param pos1
 * @param pos2
 * @returns
 */
function calculateDistance(pos1: RoomPosition, pos2: RoomPosition): number {
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
}

/**
 * 以贪心算法对目标进行排序
 * @param startPos
 * @param targets
 * @returns
 */
function sortTargetsByDistance(startPos: RoomPosition, targets: TransferTargetType[]): TransferTargetType[] {
    if (targets.length === 0) {
        return [];
    }

    // 找到距离起始点最近的位置
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(startPos, targets[0].pos);

    for (let i = 1; i < targets.length; i++) {
        const distance = calculateDistance(startPos, targets[i].pos);
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = i;
        }
    }

    // 将最近点移除数组，并递归调用此函数处理剩余的位置
    const nearestTarget = targets.splice(nearestIndex, 1)[0];
    const sortedRemaining = sortTargetsByDistance(nearestTarget.pos, targets);

    // 将当前最近点加入结果数组的前端
    return [nearestTarget, ...sortedRemaining];
}

// function sortTargetsByDistance(startPos: RoomPosition, targets: TransferTargetType[]): TransferTargetType[] {
//     const unsortTargets = targets

//     let result: TransferTargetType[] = [];
//     let currentPos = startPos;

//     while (unsortTargets.length > 0) {
//         let nextTarget = currentPos.findClosestByPath(unsortTargets, { ignoreCreeps: true });
//         if (nextTarget) {
//             result.push(nextTarget);
//             // 将当前位置更新为刚找到的最近位置
//             currentPos = nextTarget.pos;
//             // 从待排序数组中移除已经添加到结果中的目标
//             _.remove(unsortTargets, target => target === nextTarget);
//         } else {
//             // 如果没有找到下一个位置（例如由于路径不可达），则跳出循环
//             break;
//         }
//     }
//     return result
// }
