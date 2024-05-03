interface Room {
    /**
     * 尝试spawn一个creep
     * @param role 角色
     * @param bodyConfigFunc 产生bodyConfig的函数 (room) => bodyConfig[]
     * @param task 任务，默认为null
     * @param opt spawn选项
     * @param targetRoomName creep所属房间，默认是spawn所在房间
     */
    trySpawn(role: RoleType, bodyConfigFunc: BodyConfigFunc, task?: ITask, opt?: SpawnOptions, targetRoomName?: string): string | undefined
}
