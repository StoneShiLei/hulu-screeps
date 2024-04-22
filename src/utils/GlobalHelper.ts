

export class GlobalHelper {
    static deref(ref: string): RoomObject | null{
        // 尝试使用 ID 获取对象
        let object = Game.getObjectById<IdObj>(ref);
        if (object) {
            return object;
        }

        // 如果 ID 获取不到对象，尝试使用名称获取 creep
        let creep = Game.creeps[ref];
        if (creep) {
            return creep;
        }

        // 尝试使用名称获取 flag
        let flag = Game.flags[ref];
        if (flag) {
            return flag;
        }

        // 尝试使用名称获取 spawn
        let spawn = Game.spawns[ref];
        if (spawn) {
            return spawn;
        }

        // 如果所有尝试都失败，返回 null
        return null;
    }

    static deRoomPosition(protoPos:ProtoPos):RoomPosition{
        return new RoomPosition(protoPos.x,protoPos.y,protoPos.roomName)
    }
}
