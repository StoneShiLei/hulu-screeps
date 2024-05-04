import { Scheduler } from "./scheduler";
import { RoomStatusEnum } from "global/const/const";
import { FillAction } from "roomEngine/action/fillAction";
import { TransferTargetType } from "task/instances/task_transfer";

export class SpawnScheduler extends Scheduler<TransferTargetType> {

    constructor(room: Room, idleCreeps: Creep[]) {
        super(room, idleCreeps)
        this.strategy = this.updateStrategy()
    }

    updateStrategy(): IRoomStrategy<TransferTargetType> | undefined {
        switch (this.room.status) {
            case RoomStatusEnum.Low:
                return new Low(this.room)
            case RoomStatusEnum.Medium:
                return new Medium(this.room);
            case RoomStatusEnum.High:
                return new High(this.room);
            default:
                return undefined
        }
    }

    /**
     * 生成任务包，重写基类方法
     * @returns
     */
    generateTaskPackage(): TaskPackage<TransferTargetType> | undefined {
        const strategy = this.strategy
        if (!strategy) return undefined
        if (this.room.spawns.length == 0) return undefined

        //统计当前以spawn和extension为目标的所有creeps正在输送的energy总量
        const hive = [...this.room.spawns, ...this.room.extensions]
        const totalEnergyIsSending = hive.reduce((totalEnergy, structure) => {
            const creeps = structure.targetedBy || [];
            return totalEnergy + creeps.reduce((sum, creep) => sum + (creep.store[RESOURCE_ENERGY] || 0), 0);
        }, 0);

        //已有+正在运输的能量 >= 房间最大储量 则不生成任务
        if (this.room.energyAvailable + totalEnergyIsSending >= this.room.energyCapacityAvailable) return undefined

        //筛选creeps,将符合条件的指派给任务目标
        //用不符合条件的替换原有数组
        //注意这里必须使用splice来操作数组，否则无法影响外部原数组
        const filtedCreeps: Creep[] = [];
        let remainingCreeps: Creep[] = [];
        this.idleCreeps.forEach(creep => {
            if (strategy.creepsFilter(creep)) {
                filtedCreeps.push(creep);
            } else {
                remainingCreeps.push(creep);
            }
        });


        // 随便选择一个目标，简单起见，选择第一个spawn作为目标
        const target = this.room.spawns[0];

        // 计算需要多少能量来填满房间,并分配creep
        let totalAssignedEnergy = 0;
        const assignedCreeps: Creep[] = [];

        for (let i = 0; i < filtedCreeps.length && totalAssignedEnergy + this.room.energyAvailable < this.room.energyCapacityAvailable;) {
            const creep = filtedCreeps[i]; // 获取当前索引的 creep

            assignedCreeps.push(creep);
            totalAssignedEnergy += creep.store[RESOURCE_ENERGY] || 0;

            // 移除当前处理的 creep，不增加索引
            filtedCreeps.splice(i, 1);

            // 如果已经达到所需能量，则终止循环
            if (totalAssignedEnergy + this.room.energyAvailable >= this.room.energyCapacityAvailable) {
                break;
            }
        }

        //将未用完的creeps返还
        remainingCreeps = remainingCreeps.concat(filtedCreeps)
        this.idleCreeps.splice(0, this.idleCreeps.length, ...remainingCreeps);

        // 创建任务包
        const taskPackage: TaskPackage<TransferTargetType> = {
            targets: [{
                target: target,
                creeps: assignedCreeps,
            }],
            action: strategy.getAction().actionMethod,
            needSpawn: false,
            room: this.room
        };

        return taskPackage;
    }
}


class Low implements IRoomStrategy<TransferTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        return 90
    }
    generateTargets(): TransferTargetType[] {
        throw new Error("Method not implemented.");
    }
    creepsFilter(creep: Creep): boolean {
        return !creep.isEmptyStore && creep.role == "worker" && !creep.spawning
    }
    getAction(): ActionDetail<TransferTargetType> {
        return {
            actionMethod: FillAction.fillSpawn,
        }
    }

}

class Medium implements IRoomStrategy<TransferTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        throw new Error("Method not implemented.");
    }
    generateTargets(): TransferTargetType[] {
        throw new Error("Method not implemented.");
    }
    creepsFilter(creep: Creep): boolean {
        throw new Error("Method not implemented.");
    }
    getAction(): ActionDetail<TransferTargetType> {
        throw new Error("Method not implemented.");
    }

}


class High implements IRoomStrategy<TransferTargetType> {
    room: Room

    constructor(room: Room) {
        this.room = room
    }

    priority(): number {
        throw new Error("Method not implemented.");
    }
    generateTargets(): TransferTargetType[] {
        throw new Error("Method not implemented.");
    }
    creepsFilter(creep: Creep): boolean {
        throw new Error("Method not implemented.");
    }
    getAction(): ActionDetail<TransferTargetType> {
        throw new Error("Method not implemented.");
    }

}
