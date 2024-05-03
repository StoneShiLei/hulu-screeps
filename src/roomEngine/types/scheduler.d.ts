/**
 * 任务策略详细
 */
interface StrategyDetail<T extends TargetType> {
    strategyMethod: StrategyMethodType<T>
    shouldSpawn?: boolean
    creepsPerTarget?: number
}

/**
 * 任务调度器
 */
interface IScheduler<T extends TargetType> {
    /**
     * 调度优先级，更高优先级的优先执行
     */
    priority(): number
    /**
     * 生成任务包
     */
    generateTaskPackage(): TaskPackage<T> | undefined

    /**
     * 根据房间的状态，使用不同的策略
     */
    updateStrategy(): IRoomStrategy<T> | undefined
}

/**
 * 房间状态策略
 */
interface IRoomStrategy<T extends TargetType> {
    /**
     *  房间
     */
    room: Room
    /**
     * 调度优先级，更高优先级的优先执行
     */
    priority(): number
    /**
     * 生成任务目标
     */
    generateTargets(): T[];
    /**
     * 过滤符合任务工作条件的creep
     */
    creepsFilter(creep: Creep): boolean;
    /**
     * 根据房间情况选择合适的执行策略
     */
    getStrategy(): StrategyDetail<T>;
}
