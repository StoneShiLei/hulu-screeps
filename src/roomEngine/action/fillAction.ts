import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { TransferTargetType } from "task/instances/task_transfer";

/**
 * 计算两点之间的直线距离（不考虑地形）
 * @param pos1 第一个位置
 * @param pos2 第二个位置
 * @returns 直线距离
 */
function calculateDistance(pos1: RoomPosition, pos2: RoomPosition): number {
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
}

function sortExtensionsByDistance(creep: Creep, targets: TransferTargetType[]): TransferTargetType[] {
    return targets.sort((a, b) => {
        const distA = calculateDistance(creep.pos, a.pos);
        const distB = calculateDistance(creep.pos, b.pos);
        return distA - distB;
    });
}

export class FillAction extends Action {

    static fillSpawn(targets: TransferTargetType[], role: RoleType, room: Room) {
        return function () {
            const creeps = room.creeps(role, false).filter(c => c.isIdle)

            creeps.forEach(creep => {

                targets = sortExtensionsByDistance(creep, targets)

                let capacity = creep.isEmptyStore ? creep.store.getCapacity(RESOURCE_ENERGY) : creep.store.getUsedCapacity(RESOURCE_ENERGY)

                const fillTasks: ITask[] = []
                while (capacity > 0) {
                    const target = targets.shift()
                    if (!target) return
                    fillTasks.push(TaskHelper.transfer(target))
                    capacity -= target.store.getCapacity(RESOURCE_ENERGY)
                }

                const tasks = Action.genTaskList(creep, ...fillTasks)
                creep.task = TaskHelper.chain(tasks)
            })
        }
    }

    static fillTower(targets: TransferTargetType[], role: RoleType, room: Room) {
        return function () {
            const creeps = room.creeps(role, false).filter(c => c.isIdle)

            targets.forEach(target => {
                creeps.forEach(creep => {
                    const task = TaskHelper.transfer(target)
                    const tasks = Action.genTaskList(creep, task)
                    creep.task = TaskHelper.chain(tasks)
                })
            })

        }
    }
}
