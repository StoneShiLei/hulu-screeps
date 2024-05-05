import { taskMap } from "task/helper/TaskRegistry";
import { GlobalHelper } from "utils/GlobalHelper";
import { Logger } from "utils/Logger";

export abstract class Task<TTargetType extends TargetType> implements ITask {
    name: string;
    _creep: { name: string };
    _target: ProtoTargetType;
    _parent: ProtoTask | null;
    data: TaskData;
    option: TaskOption;
    setting: TaskSetting;

    // log: Logger;

    constructor(taskName: string, target: TargetType, option = {} as TaskOption) {
        this.name = taskName
        this._creep = {
            name: ''
        }
        this._parent = null

        this.data = {}
        this.setting = {
            workOffRoad: false,
            oneShot: false,
            targetRange: 1
        }

        _.defaults(option, {
            blind: false,
            moveNextTarget: false,
            moveOptions: {},
        })
        this.option = option


        if (target) {
            this._target = {
                ref: target.ref,
                _pos: {
                    x: target.pos.x,
                    y: target.pos.y,
                    roomName: target.pos.roomName
                }
            }
        }
        else {
            this._target = {
                ref: '',
                _pos: {
                    x: -1,
                    y: -1,
                    roomName: ''
                }
            }
        }

        // this.log = Container.get(Logger)
        // if (this.creep) {
        //     this.log = this.log.withCreep(this.creep).withRoom(this.creep.room)
        // }
    }


    get creep(): Creep {
        return Game.creeps[this._creep.name]
    }
    set creep(creep: Creep) {
        this._creep.name = creep.name
    }

    get target(): TTargetType | null {
        return GlobalHelper.deref(this._target.ref) as TTargetType | null
    }
    get targetPos(): RoomPosition {
        if (this.target) this._target._pos = this.target.pos //如果可见刷新pos
        return GlobalHelper.deRoomPosition(this._target._pos)
    }

    get proto(): ProtoTask {
        return this as ProtoTask
    }
    set proto(protoTask: ProtoTask) {
        this._creep = protoTask._creep
        this._parent = protoTask._parent
        this._target = protoTask._target
        this.option = protoTask.option
        this.data = protoTask.data
    }


    get parent(): Task<TargetType> | null {
        return this._parent ? initTask(this._parent) : null
    }

    set parent(parentTask: Task<TargetType> | null) {
        this._parent = parentTask ? parentTask.proto : null
        if (this.creep) this.creep.task = this
    }

    fork(newTask: ITask): ITask {
        newTask.parent = this;
        if (this.creep) {
            this.creep.task = newTask;
        }
        return newTask;
    }

    moveToTarget(range?: number): number {
        if (range === undefined) range = this.setting.targetRange

        this.option.moveOptions = this.option.moveOptions || {}
        this.option.moveOptions.range = range

        return this.creep.moveTo(this.targetPos, this.option.moveOptions);
    }

    moveToNextPos(): number | undefined {
        if (!this.parent?.target) return

        return this.creep.moveTo(this.parent.target.pos, this.parent.option.moveOptions)
    }


    isValid(): boolean {
        //强制持续执行
        // if (this.option.keep) return true

        let validTask = false
        if (this.creep) {
            validTask = this.isValidTask()
        }
        let validTarget = false
        if (this.target) {
            validTarget = this.isValidTarget()
        }
        //如果任务无视迷雾，则通过验证
        else if (this.option.blind && !Game.rooms[this.targetPos.roomName]) {
            validTarget = true
        }
        else { }

        if (validTask && validTarget) {
            return true
        }
        else {
            this.finish()
            return this.parent ? this.parent.isValid() : false
        }
    }

    run(): number {

        if (this.creep.pos.inRangeTo(this.targetPos, this.setting.targetRange)) { //and 不在边缘)
            let result = this.work()

            //只执行一次的任务
            if (result == OK && this.setting.oneShot) {
                this.finish()
            }
            return result
        }
        else {
            return this.moveToTarget()
        }
    }

    finish(): number {
        if (this.creep) {
            //向父任务目标移动
            if (this.option.moveNextTarget) {
                this.moveToNextPos();
            }
            //指向父任务
            this.creep.task = this.parent;
        } else {
            // this.log.logInfo(`No creep executing ${this.name}!`)
        }
        return OK
    }

    abstract isValidTask(): boolean;
    abstract isValidTarget(): boolean;
    abstract work(): number
}

/**
 * 初始化任务
 * @param protoTask 原型任务
 * @returns
 */
export function initTask(protoTask: ProtoTask): Task<TargetType> {
    let taskName = protoTask.name
    let target = GlobalHelper.deref(protoTask._target.ref)

    const createInstance = taskMap.get(taskName);

    if (!createInstance) {
        return new TaskInvalid(target, protoTask.option);
    }

    const task = createInstance(target, protoTask.option);

    task.proto = protoTask

    return task
}

/**
 * 非法任务
 */
class TaskInvalid extends Task<any> {

    static taskName = 'invalid'

    constructor(target: any, options = {} as TaskOption) {
        super('INVALID', target, options);
    }

    isValidTask(): boolean {
        return false
    }
    isValidTarget(): boolean {
        return false
    }
    work(): number {
        return OK
    }

}
