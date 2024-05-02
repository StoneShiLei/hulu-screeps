interface Room {
    /**
     * 属于这个房间的所有creep
     */
    _creeps: Creep[]
    /**
     * room.name的hash
     */
    hashCode: number
    /**
     * 获取该房间所有的creep，支持按角色分类
     * @param role 角色
     * @param ignoreSpawning 忽略正在spawn中的creep
     */
    creeps(role?: RoleType, ignoreSpawning?: boolean): Creep[]

    /**
     * 房间状态
     */
    status: RoomStatusEnum
}

/**
 * 房间状态枚举
 */
declare enum RoomStatusEnum {
    /**
     * 房间可用能量低于800
     */
    Low = 10,
    /**
     * 房间可用能量高于800，但无己方storage
     */
    Medium = 20,
    /**
     * 有己方storage
     */
    High = 30,
}

