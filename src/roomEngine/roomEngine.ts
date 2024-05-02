export class RoomEngine {
    private idleCreeps: Creep[]
    private room: Room

    constructor(room: Room) {
        this.idleCreeps = room.creeps().filter(c => c.isIdle)
        this.room = room
    }

    run() {
        //遍历当前房间所有的发布器
        //发布器最终返回任务包
    }
}
