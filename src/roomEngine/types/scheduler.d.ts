/**
 * 任务策略详细
 */
interface ActionDetail<T extends TargetType> {
    actionMethod: ActionGenerationType<T>
}

/**
 * 任务调度器
 */
interface IScheduler<T extends TargetType> {
    /**
     * 添加房间event
     */
    tryGenEventToRoom(): void

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
     * 获取任务目标
     */
    getTargets(): T[];
    /**
     * 根据房间情况选择合适的执行策略
     */
    getAction(): ActionDetail<T>;
}
