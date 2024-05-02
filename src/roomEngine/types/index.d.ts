/**
 * 任务包目标类型
 */
type TaskPackageTargetType<T extends TargetType> = {
    target: T
    creeps: Creep[]
}

/**
 * 任务包
 */
interface TaskPackage<T extends TargetType> {
    targets: TaskPackageTargetType<T>[]
    strategy: StrategyMethodType<T>
    needSpawn: boolean
}

type StrategyMethodType<T extends TargetType> = (taskPackage: TaskPackage<T>) => void
