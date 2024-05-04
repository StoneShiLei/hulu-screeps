import { AttackTargetType } from "task/instances/task_attack";
import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { BodyPartHelper } from "spawnCaster/helper/BodyPartHelper";

export class InvaderAction extends Action {

    static basicDefence(targets: AttackTargetType[], role: RoleType, room: Room) {
        return function () {
            const creeps = room.creeps(role, false).filter(c => c.isIdle)

            creeps.forEach(creep => {
                const target = creep.pos.findClosestByPath(targets)
                if (!target) return
                creep.task = TaskHelper.meleeAttack(target)
            })

            // if (taskPackage.needSpawn) {
            //     taskPackage.room.trySpawn('basicDefender', (room: Room): BodyPartConstant[] => {
            //         const attackBodyCost = BODYPART_COST[ATTACK] + 3 * BODYPART_COST[MOVE]
            //         const bodyCount = Math.floor(room.energyCapacityAvailable / attackBodyCost)
            //         const body = BodyPartHelper.convertBodyPart({ [MOVE]: bodyCount * 3, [ATTACK]: bodyCount })
            //         return body
            //     })
            // }
        }
    }
}
