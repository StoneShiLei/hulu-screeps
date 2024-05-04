import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { TransferTargetType } from "task/instances/task_transfer";

export class FillAction extends Action {

    static sortByDistance(creep: Creep, targets: TransferTargetType[]): TransferTargetType[] {

        const getRangeTo = function (sourcePos: RoomPosition, targetPos: RoomPosition): number {
            return Math.sqrt(Math.pow(sourcePos.x - targetPos.x, 2) + Math.pow(sourcePos.y - targetPos.y, 2));
        }

        return targets.sort((a, b) => {
            return getRangeTo(creep.pos, a.pos) - getRangeTo(creep.pos, b.pos)
        })
    }

    static fillSpawn(targets: TransferTargetType[], role: RoleType, room: Room) {
        return function () {
            const creeps = room.creeps(role, false).filter(c => c.isIdle)

            creeps.forEach(creep => {
                targets = FillAction.sortByDistance(creep, targets)

                let capacity = creep.isEmptyStore ? creep.store.getCapacity(RESOURCE_ENERGY) : creep.store.getUsedCapacity(RESOURCE_ENERGY)

                const fillTasks: ITask[] = []
                while (capacity > 0) {
                    const target = targets.shift()
                    if (!target) break
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
