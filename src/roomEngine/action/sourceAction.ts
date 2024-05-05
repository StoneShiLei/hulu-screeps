import { HarvestTargetType } from "task/instances/task_harvest";
import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { HarvesterBodyConfig } from "role/bodyConfig/harvester";
import { SourceConstantHarvestTargetType } from "task/instances/task_sourceConstantHarvest";
import { WithdrawTargetType } from "task/instances/task_withdraw";
import { CarrierBodyConfig } from "role/bodyConfig/carrier";

export class SourceAction extends Action {

    static withdrawSourceContainer(targets: WithdrawTargetType[], role: RoleType, room: Room) {
        return function () {

            room.idleCreeps(role).filter(c => c.isEmptyStore).forEach(creep => {
                const target = targets.shift()
                if (!target) return
                creep.task = TaskHelper.withdraw(target, { resourceType: RESOURCE_ENERGY })
            })

            if (room.creeps('carrier', false).length == 0 || targets.length) {
                room.spawnQueue.push({
                    role: role,
                    bodyFunc: CarrierBodyConfig.carrier,
                })
            }
        }
    }

    static constantHarvest(targets: SourceConstantHarvestTargetType[], role: RoleType, room: Room) {
        return function () {

            targets.forEach(source => {

                const tasks: ITask[] = [TaskHelper.sourceConstantHarvest(source)]
                if (source.container) {
                    tasks.unshift(TaskHelper.goto(source.container, { targetRange: 0 }))
                }

                room.spawnQueue.push({
                    role: role,
                    bodyFunc: HarvesterBodyConfig.sourceHarvester,
                    task: TaskHelper.chain(tasks)
                })
                return

            })


        }
    }

    static harvest(targets: HarvestTargetType[], role: RoleType, room: Room) {
        return function () {
            const creeps = room.idleCreeps(role, false)

            const target = targets.shift()
            if (!target) return

            if (creeps.length) creeps[0].task = TaskHelper.harvest(target)
        }
    }
}
