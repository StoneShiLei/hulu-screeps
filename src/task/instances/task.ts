import { initTask } from "task/initTask";
import { GlobalHelper } from "utils/GlobalHelper";

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

    constructor(taskName:string,target:TargetType,option = {} as TaskOption) {
        this.name = taskName
        this._creep = {
            name:''
        }
        this._parent = null

        this.data = {}
        this.setting = {}
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
        throw new Error("Method not implemented.");
    }

    run(): void {
        if(this.isValid()){
            this.work()
        } else {
            this.finish()
        }
    }

    finish(): void {
        // this.moveToNextPos();
		if (this.creep) {
			this.creep.task = this.parent;
		} else {
			console.log(`No creep executing ${this.name}!`);
		}
    }

    abstract isValidTask(): boolean;
    abstract isValidTarget(): boolean;
    abstract work():number
}
