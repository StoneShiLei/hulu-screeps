export abstract class Scheduler<T extends TargetType> implements IScheduler<T> {
    protected readonly room: Room;
    protected idleCreeps: Creep[]

    constructor(room: Room, idleCreeps: Creep[]) {
        this.room = room;
        this.idleCreeps = idleCreeps
    }

    /**
     * 生成任务包
     */
    generateTaskPackage(): TaskPackage<T> | undefined {
        const t = this.generateTargets();
        if (!t.length) return undefined;

        //筛选creeps,将符合条件的指派给任务目标
        //用不符合条件的替换原有数组
        //注意这里必须使用splice来操作数组，否则无法影响外部原数组
        const creepsToRemove: Creep[] = [];
        const remainingCreeps: Creep[] = [];
        this.idleCreeps.forEach(creep => {
            if (this.creepsFilter(creep)) {
                creepsToRemove.push(creep);
            } else {
                remainingCreeps.push(creep);
            }
        });
        this.idleCreeps.splice(0, this.idleCreeps.length, ...remainingCreeps);


        const strategyDetail = this.getStrategy()
        const targets = t.map(t => ({ target: t, creeps: [] as Creep[] }))
        //待分配creep < 目标 * 单目标分配数量 && 需要spawn
        let needSpawn = creepsToRemove.length <
            targets.length * strategyDetail.creepsPerTarget &&
            strategyDetail.shouldSpawn

        //为每个target分配指定数量的creep，如果不足以分配则分配剩下全部的creep
        targets.forEach(target => {
            const numberToAssign = Math.min(strategyDetail.creepsPerTarget, creepsToRemove.length);
            target.creeps = creepsToRemove.splice(0, numberToAssign);
        });

        return { targets, strategy: strategyDetail.strategyName, needSpawn };
    }

    /**
     * 调度优先级，更高优先级的优先执行
     */
    abstract priority(): number;
    /**
     * 生成任务目标
     */
    abstract generateTargets(): T[];
    /**
     * 过滤符合任务工作条件的creep
     */
    abstract creepsFilter(creep: Creep): boolean;
    /**
     * 根据房间情况选择合适的策略
     */
    abstract getStrategy(): StrategyDetail
}
