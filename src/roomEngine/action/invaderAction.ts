import { AttackTargetType } from "task/instances/task_attack";
import { Action } from "./action";
import { TaskHelper } from "task/TaskHelper";
import { BodyPartHelper } from "spawnCaster/helper/BodyPartHelper";

export class InvaderAction extends Action {

    static basicDefence(targets: AttackTargetType[], role: RoleType, room: Room) {
        return function () {
            const creeps = room.idleCreeps(role, false)

            creeps.forEach(creep => {
                const target = creep.pos.findClosestByPath(targets)
                if (!target) return
                creep.task = TaskHelper.meleeAttack(target)
            })

            if (room.creeps(role, false).length < 3) {
                room.spawnQueue.push({
                    role: role,
                    bodyFunc: (room: Room): BodyPartConstant[] => {
                        const attackBodyCost = BODYPART_COST[ATTACK] + 3 * BODYPART_COST[MOVE]
                        const bodyCount = Math.floor(room.energyCapacityAvailable / attackBodyCost)
                        const body = BodyPartHelper.convertBodyPart({ [MOVE]: bodyCount * 3, [ATTACK]: bodyCount })
                        return body
                    },
                })
            }
        }
    }
}
