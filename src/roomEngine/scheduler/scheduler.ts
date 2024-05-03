
export abstract class Scheduler<T extends TargetType> implements IScheduler<T> {
    protected readonly room: Room;
    protected idleCreeps: Creep[]
    protected strategy: IRoomStrategy<T> | undefined

    constructor(room: Room, idleCreeps: Creep[]) {
        this.room = room;
        this.idleCreeps = idleCreeps
        this.strategy = this.updateStrategy()
    }

    abstract updateStrategy(): IRoomStrategy<T> | undefined;

    /**
     * 调度优先级，更高优先级的优先执行
     */
    priority(): number {
        return this.strategy?.priority() || 0;
    }

    /**
     * 生成任务包
     */
    generateTaskPackage(): TaskPackage<T> | undefined {
        const strategy = this.strategy
        if (!strategy) return undefined
        const t = strategy.generateTargets();
        if (!t.length) return undefined;

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



        const strategyDetail = strategy.getStrategy()
        strategyDetail.shouldSpawn = strategyDetail.shouldSpawn || false
        strategyDetail.creepsPerTarget = strategyDetail.creepsPerTarget || 1

        const targets = t.map(t => ({ target: t, creeps: [] as Creep[] }))
        //待分配creep < 目标 * 单目标分配数量 && 需要spawn
        let needSpawn = filtedCreeps.length <
            targets.length * strategyDetail.creepsPerTarget &&
            strategyDetail.shouldSpawn

        //为每个target分配指定数量的creep，如果不足以分配则分配剩下全部的creep
        targets.forEach(target => {
            const numberToAssign = Math.min(strategyDetail.creepsPerTarget || 1, filtedCreeps.length);
            target.creeps = filtedCreeps.splice(0, numberToAssign);
        });

        //将未用完的creeps返还
        remainingCreeps = remainingCreeps.concat(filtedCreeps)
        this.idleCreeps.splice(0, this.idleCreeps.length, ...remainingCreeps);

        return { targets, strategy: strategyDetail.strategyMethod, needSpawn, room: this.room };
    }
}
