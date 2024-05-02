/**
 * 策略详细
 */
interface StrategyDetail {
    strategyName: string
    shouldSpawn: boolean
    creepsPerTarget: number
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
}
