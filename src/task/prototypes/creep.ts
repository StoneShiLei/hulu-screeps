import { initTask } from "task/initTask"

export class CreepExtension extends Creep {


    taskGetter():ITask | null{
        if(!this.task){
            let protoTask = this.memory.task
            this._task = protoTask ? initTask(protoTask) : null
        }
        return this._task
    }
    taskSetter(task:ITask | null){
        this.memory.task = task ? task.proto:null
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
    }
}
