import { BuildTargetType, TaskBuild } from "task/instances/task_build";
import { GoToTargetType, TaskGoto } from "task/instances/task_goto";
import { SourceHarvestTargetType, TaskSourceHarvest } from "task/instances/task_sourceHarvest";
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
import { TaskConstantUpgrade } from "./instances/task_constantUpgrade";
import { TransferAllTargetType, TaskTransferAll } from "./instances/task_transferAll";
import { WithdrawAllTargetType, TaskWithdrawAll } from "./instances/task_withdrawAll";
import { GetRenewedTargetType, TaskGetRenewed } from "./instances/task_getRenewed";
import { DropTargetType, TaskDrop } from "./instances/task_drop";
import { HealTargetType, TaskHeal } from "./instances/task_heal";
import { GetBoostedTargetType, TaskGetBoosted } from "./instances/task_getBoosted";
import { MineralHarvestTargetType, TaskMineralHarvest } from "./instances/task_mineralHarvest";
import { GetRecycledTargetType, TaskGetRecycled } from "./instances/task_getRecycled";

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

    static getBoosted(target: GetBoostedTargetType, option?: TaskOption): TaskGetBoosted {
        return new TaskGetBoosted(target, option)
    }

    static harvest(target: HarvestTargetType, option?: TaskOption): TaskHarvest {
        return new TaskHarvest(target, option)
    }

    static sourceHarvest(target: SourceHarvestTargetType, option?: TaskOption): TaskSourceHarvest {
        return new TaskSourceHarvest(target, option)
    }

    static mineralHarvest(target: MineralHarvestTargetType, option?: TaskOption): TaskMineralHarvest {
        return new TaskMineralHarvest(target, option)
    }

    static transfer(target: TransferTargetType, option?: TaskOption): TaskTransfer {
        return new TaskTransfer(target, option)
    }

    static withdraw(target: WithdrawTargetType, option?: TaskOption): TaskWithdraw {
        return new TaskWithdraw(target, option)
    }

    static transferAll(target: TransferAllTargetType, option?: TaskOption): TaskTransferAll {
        return new TaskTransferAll(target, option)
    }

    static withdrawAll(target: WithdrawAllTargetType, option?: TaskOption): TaskWithdrawAll {
        return new TaskWithdrawAll(target, option)
    }

    static upgrade(target: UpgradeTargetType, option?: TaskOption): TaskUpgrade {
        return new TaskUpgrade(target, option)
    }

    static constantUpgrade(target: UpgradeTargetType, option?: TaskOption): TaskConstantUpgrade {
        return new TaskConstantUpgrade(target, option)
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

    static heal(target: HealTargetType, option?: TaskOption): TaskHeal {
        return new TaskHeal(target, option)
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

    static getRenewd(target: GetRenewedTargetType, option?: TaskOption): TaskGetRenewed {
        return new TaskGetRenewed(target, option)
    }

    static getRecycled(target: GetRecycledTargetType, option?: TaskOption): TaskGetRecycled {
        return new TaskGetRecycled(target, option)
    }

    static drop(target: DropTargetType, option?: TaskOption): TaskDrop {
        return new TaskDrop(target, option)
    }
}
