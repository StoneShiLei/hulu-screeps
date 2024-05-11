interface RoomPosition {

    /**
     * 是否是房间边缘
     */
    isEdge: boolean

    /**
     * 位置是否可到达
     * @param ignoreCreep 忽略creep
     * @param ignoreRampartOwner 需忽略的rampart拥有者userName
     */
    isWalkable(ignoreCreep?: boolean, ignoreRampartOwner?: string): boolean

    /**
     * 获取目标pos周围的pos数组
     * @param range 范围
     */
    surroundPos(range?: number): RoomPosition[]
}
