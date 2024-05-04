import { AttackTargetType } from "task/instances/task_attack";
import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { BodyPartHelper } from "spawnCaster/helper/BodyPartHelper";

export class InvaderAction extends Action {
    static basicDefence(taskPackage: TaskPackage<AttackTargetType>) {
        taskPackage.targets.forEach(targetPackage => {
            targetPackage.creeps.forEach(creep => {
                const target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
                if (!target) return
                creep.task = TaskHelper.meleeAttack(target)
            })
        })

        if (taskPackage.needSpawn) {
            taskPackage.room.trySpawn('basicDefender', (room: Room): BodyPartConstant[] => {
                const attackBodyCost = BODYPART_COST[ATTACK] + 3 * BODYPART_COST[MOVE]
                const bodyCount = Math.floor(room.energyCapacityAvailable / attackBodyCost)
                const body = BodyPartHelper.convertBodyPart({ [MOVE]: bodyCount * 3, [ATTACK]: bodyCount })
                return body
            })
        }
    }
}
