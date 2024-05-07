import { Action } from "./action";
import { WithdrawTargetType } from "task/instances/task_withdraw";
import { CarrierBodyConfig } from "role/bodyConfig/carrier";

export class ContainerAction extends Action {

    static withdrawSourceContainer(targets: WithdrawTargetType[], role: RoleType, room: Room) {
        return function () {

            //包装父类方法
            Action.withdrawResource(targets, role, room, { resourceType: RESOURCE_ENERGY })()

            if (room.creeps('carrier', false).length == 0 || targets.length) {
                room.spawnQueue.push({
                    role: role,
                    bodyFunc: CarrierBodyConfig.carrier,
                })
            }
        }
    }
}
