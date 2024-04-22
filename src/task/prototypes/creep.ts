import { initTask } from "task/initTask"

export class CreepExtension extends Creep {


    taskGetter():ITask | null{
        if(!this._task){
            let protoTask = this.memory.task
            this._task = protoTask ? initTask(protoTask) : null
        }
        return this._task
    }
    taskSetter(task:ITask | null){
        this.memory.task = task ? task.proto:null
        if(task){
            // if(task.target){
            //     if(!Game)
            // }
            task.creep =this
        }
        this._task = null
    }
    hasValidTaskGetter():boolean{
        return !!this.task && this.task.isValid()
    }
    isIdleGetter():boolean {
        return !this.hasValidTask
    }
    run(){
        if(this.task){
            return this.task.run()
        }
        return
    }
}
