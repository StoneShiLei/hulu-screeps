import { BuildTargetType, TaskBuild } from "task/instances/task_build";
import { GoToTargetType, TaskGoto } from "task/instances/task_goto";
import { SourceConstantHarvestTargetType, TaskSourceConstantHarvest } from "task/instances/task_sourceConstantHarvest";
import { PickupTargetType, TaskPickup } from "task/instances/task_pickup";
import { HarvestTargetType, TaskHarvest } from "./instances/task_harvest";
import { TaskTransfer, TransferTargetType } from "./instances/task_transfer";
import { TaskUpgrade, UpgradeTargetType } from "./instances/task_upgrade";
import { TaskWithdraw, WithdrawTargetType } from "./instances/task_withdraw";
import { AttackTargetType, TaskAttack } from "./instances/task_attack";
import { MeleeAttackTargetType, TaskMeleeAttack } from "./instances/task_meleeAttack";
import { RangedAttackTargetType, TaskRangedAttack } from "./instances/task_rangedAttack";
import { ReserveTargetType, TaskReserve } from "./instances/task_reserve";
import { ClaimTargetType, TaskClaim } from "./instances/task_claim";
import { SignTargetType, TaskSign } from "./instances/task_sign";
import { FortifyTargetType, TaskFortify } from "./instances/task_fortify";
import { DismantleTargetType, TaskDismantle } from "./instances/task_dismantle";
import { RepairTargetType, TaskRepair } from "./instances/task_repair";

/**
 * 任务帮助
 */
export class TaskHelper {

    /**
     *  构造任务链，将一系列任务构造为单个任务，互相关联
     * @param tasks 任务数组，先进先出，先进为子，后进为父
     * @param setNextPos 执行完子任务后是否向父任务移动，防止空转一tick
     * @returns 子任务
     */
    static chain(tasks: ITask[], setNextPos = true): ITask | null {
        if (!tasks.length) return null
        if (setNextPos) {
            _.each(tasks, task => task.option.moveNextTarget = true)
        }

        let task = _.last(tasks)
        tasks = _.dropRight(tasks);
        //关联父子任务
        for (let i = (tasks.length - 1); i >= 0; i--) {
            task = task.fork(tasks[i]);
        }

        return task
    }

    static harvest(target: HarvestTargetType, option?: TaskOption): TaskHarvest {
        return new TaskHarvest(target, option)
    }

    static sourceConstantHarvest(target: SourceConstantHarvestTargetType, option?: TaskOption): TaskSourceConstantHarvest {
        return new TaskSourceConstantHarvest(target, option)
    }

    static transfer(target: TransferTargetType, option?: TaskOption): TaskTransfer {
        return new TaskTransfer(target, option)
    }

    static withdraw(target: WithdrawTargetType, option?: TaskOption): TaskWithdraw {
        return new TaskWithdraw(target, option)
    }

    static upgrade(target: UpgradeTargetType, option?: TaskOption): TaskUpgrade {
        return new TaskUpgrade(target, option)
    }

    static build(target: BuildTargetType, option?: TaskOption): TaskBuild {
        return new TaskBuild(target, option)
    }

    static goto(target: GoToTargetType, option?: TaskOption): TaskGoto {
        return new TaskGoto(target, option)
    }

    static pickup(target: PickupTargetType, option?: TaskOption): TaskPickup {
        return new TaskPickup(target, option)
    }

    static attack(target: AttackTargetType, option?: TaskOption): TaskAttack {
        return new TaskAttack(target, option)
    }


    static meleeAttack(target: MeleeAttackTargetType, option?: TaskOption): TaskMeleeAttack {
        return new TaskMeleeAttack(target, option)
    }


    static rangedAttack(target: RangedAttackTargetType, option?: TaskOption): TaskRangedAttack {
        return new TaskRangedAttack(target, option)
    }


    static reserve(target: ReserveTargetType, option?: TaskOption): TaskReserve {
        return new TaskReserve(target, option)
    }


    static claim(target: ClaimTargetType, option?: TaskOption): TaskClaim {
        return new TaskClaim(target, option)
    }


    static sign(target: SignTargetType, option?: TaskOption): TaskSign {
        return new TaskSign(target, option)
    }


    static fortify(target: FortifyTargetType, option?: TaskOption): TaskFortify {
        return new TaskFortify(target, option)
    }


    static dismantle(target: DismantleTargetType, option?: TaskOption): TaskDismantle {
        return new TaskDismantle(target, option)
    }


    static repair(target: RepairTargetType, option?: TaskOption): TaskRepair {
        return new TaskRepair(target, option)
    }
}
