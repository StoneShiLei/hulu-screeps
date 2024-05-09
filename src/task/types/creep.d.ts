
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

    /**
     * 压入新的task
     * @param task 若干的task
     */
    pressTask(...task: ITask[]): void

    /**
     * 压入新的task并立即执行
     * @param task 若干的task
     */
    pressTaskAndRun(...task: ITask[]): void
}
