
interface ProtoTask {
    name:string
    _target: {
        ref:string
        pos:ProtoPos
    }
}

interface ITask extends ProtoTask {

}

interface ProtoPos {
	x: number;
	y: number;
	roomName: string;
}
