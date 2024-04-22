
interface Creep {
    task:ITask | null
    _task:ITask | null
    hasValidTask:boolean
    isIdle:boolean
    run():void
}
