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

}

