import { HarvestTargetType } from "task/instances/task_harvest";
import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { WorkerBodyConfig } from "role/bodyConfig/worker";
import { HarvesterBodyConfig } from "role/bodyConfig/harvester";
import { SourceConstantHarvestTargetType } from "task/instances/task_sourceConstantHarvest";

export class SourceAction extends Action {

    static constantHarvest(targets: SourceConstantHarvestTargetType[], role: RoleType, room: Room) {
        return function () {

            targets.forEach(source => {

                //如果没有能运送的，先spawn一个能运送的
                if (room.creeps('carrier', false).length + room.creeps('worker').length == 0) {
                    room.spawnQueue.push({
                        role: 'worker',
                        bodyFunc: WorkerBodyConfig.mediumWorker,
                    })
                    return
                }


                //当有多个的时候，相遇时杀死ttl低的那个
                if (source.targetedBy.length > 1) {
                    const harvesters = source.targetedBy.sort((a, b) => (a.ticksToLive || 0) - (b.ticksToLive || 0))
                    for (let i = 0; i < harvesters.length; i++) {

                        if (i + 1 == harvesters.length) break

                        if (harvesters[i].pos.isNearTo(harvesters[i + 1].pos)) {
                            harvesters[i].suicide()
                        }
                    }
                }

                if (!source.targetedBy.length || source.targetedBy && source.targetedBy.filter(c => c.role == role && (c.ticksToLive || 1500) < 300).length > 0) {

                    const tasks: ITask[] = [TaskHelper.sourceConstantHarvest(source)]
                    if (source.container) {
                        tasks.unshift(TaskHelper.goto(source.container, { targetRange: 0 }))
                    }

                    room.spawnQueue.push({
                        role: role,
                        bodyFunc: HarvesterBodyConfig.sourceHarvester,
                        task: TaskHelper.chain(tasks)
                    })
                }
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
