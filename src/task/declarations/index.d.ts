
interface ProtoTask {
    name:string
    _creep: {
        name:string
    }
    _target: {
        ref:string
        _pos:ProtoPos
    }
    _parent:ProtoTask | null
    data:TaskData
    option:TaskOption

}

interface ITask extends ProtoTask {
    setting:TaskSetting
    proto:ProtoTask
    creep:Creep
    target:RoomObject | null
    targetPos:RoomPosition
    parent:ITask | null

    fork(newTask:ITask):ITask
    moveToTarget(range?:number):number

    isValid():boolean
    run(): number | undefined
    finish():void

    isValidTask():boolean
    isValidTarget():boolean
    work():number
}

interface TaskSetting {
    targetRange?:number
}
interface TaskOption {
    moveOptions?:MoveToOpts
}
interface TaskData {

}

interface ProtoPos {
	x: number;
	y: number;
	roomName: string;
}
