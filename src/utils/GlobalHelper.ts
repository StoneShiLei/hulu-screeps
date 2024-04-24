

export class GlobalHelper {

    /**
     * 根据实体引用获取一个房间实体
     * @param ref 实体引用
     * @returns 实体
     */
    static deref(ref: string): RoomObject | null {
        return Game.getObjectById(ref) as unknown as RoomObject || Game.creeps[ref] ||
            Game.flags[ref] || Game.spawns[ref] || null

    }

    /**
     * 根据原型坐标创建一个RoomPosition
     * @param protoPos 原型坐标
     * @returns
     */
    static deRoomPosition(protoPos: ProtoPos): RoomPosition {
        return new RoomPosition(protoPos.x, protoPos.y, protoPos.roomName)
    }
}
