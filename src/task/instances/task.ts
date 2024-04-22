import { initTask } from "task/initTask";
import { Container, Inject } from "typescript-ioc";
import { GlobalHelper } from "utils/GlobalHelper";
import { Logger } from "utils/Logger";

export type TargetType = { ref:string,pos:RoomPosition }

export abstract class Task implements ITask{

   static taskName:string

    name: string;
    _creep: { name:string };
    _target: { ref: string; _pos: ProtoPos; };
    _parent: ProtoTask | null;
    data: TaskData;
    option: TaskOption;
    setting: TaskSetting;

    log:Logger;

    constructor(taskName:string,target:TargetType,option = {} as TaskOption) {
        this.name = taskName
        this._creep = {
            name:''
        }
        this._parent = null

        this.data = {}
        this.setting = {
            targetRange:1,
        }
        this.option = option


        if(target){
            this._target = {
                ref:target.ref,
                _pos:{
                    x:target.pos.x,
                    y:target.pos.y,
                    roomName:target.pos.roomName
                }
            }
        }
        else{
            this._target = {
                ref:'',
                _pos:{
                    x:-1,
                    y:-1,
                    roomName:''
                }
            }
        }

        this.log = Container.get(Logger)
        if(this.creep) {
            this.log = this.log.withCreep(this.creep).withRoom(this.creep.room)
        }
    }


    get creep() : Creep {
        return Game.creeps[this._creep.name]
    }
    set creep(creep: Creep) {
        this._creep.name = creep.name
    }


    get target() : RoomObject | null {
        return GlobalHelper.deref(this._target.ref)
    }
    get targetPos(): RoomPosition{
        if(this.target) this._target._pos = this.target.pos //如果可见刷新pos
        return GlobalHelper.deRoomPosition(this._target._pos)
    }

    get proto():ProtoTask{
        return this as ProtoTask
    }
    set proto(protoTask:ProtoTask){
        this._creep = protoTask._creep
        this._parent = protoTask._parent
        this._target = protoTask._target
        this.option = protoTask.option
        this.data = protoTask.data
    }


    get parent() : Task | null {
        return this._parent ? initTask(this._parent):null
    }

    set parent(parentTask : Task | null) {
        this._parent = parentTask ? parentTask.proto : null
        if(this.creep) this.creep.task = this
    }

    fork(newTask: ITask): ITask {
        newTask.parent = this;
		if (this.creep) {
			this.creep.task = newTask;
		}
		return newTask;
    }

    moveToTarget(range = this.setting.targetRange): number {
		if (this.option.moveOptions && !this.option.moveOptions.range) {
			this.option.moveOptions.range = range;
		}
		return this.creep.moveTo(this.targetPos, this.option.moveOptions);
    }


    isValid(): boolean {
        let validTask = false
        if (this.creep) {
            validTask = this.isValidTask()
        }
        let validTarget = false
        if (this.target){
            validTarget = this.isValidTarget()
        }
        // else if() blind

        this.log.logDebug(`task.isValid :task-${validTask},target-${validTarget}`)
        if (validTask && validTarget) {
            return true
        }
        else {
            this.finish()
            return this.parent ? this.parent.isValid() : false
        }
    }

    run(): number | undefined {

        this.log.logDebug(`targetPos is ${JSON.stringify(this.targetPos)}`)
        this.log.logDebug(`creep is ${this.creep.name},pos is ${JSON.stringify(this.creep?.pos)}`)
        if(this.creep.pos.inRangeTo(this.targetPos,this.setting.targetRange || 0)) { //and 不在边缘)
            let result = this.work()
            // if(result == OK){ // and oneShot)
            //     this.finish()
            // }
            return result
        }
        else {
            this.moveToTarget()
            return
        }
    }

    finish(): void {
        // this.moveToNextPos();
		if (this.creep) {
			this.creep.task = this.parent;
		} else {
            this.log.logInfo(`No creep executing ${this.name}!`)
		}
    }

    abstract isValidTask(): boolean;
    abstract isValidTarget(): boolean;
    abstract work():number
}
