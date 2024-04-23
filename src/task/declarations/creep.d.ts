
interface Creep {
    /**
     * 当前任务
     */
    task: ITask | null
    /**
     * 当前任务临时缓存
     */
    _task: ITask | null
    /**
     * 是否持有可执行的任务
     */
    hasValidTask: boolean
    /**
     * 是否闲置
     */
    isIdle: boolean
    /**
     * 执行当前任务
     */
    run(): number | undefined
}
