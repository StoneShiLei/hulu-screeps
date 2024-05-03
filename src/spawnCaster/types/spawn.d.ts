interface StructureSpawn {
    /**
     * 当前tick是否已被使用
     * @returns
     */
    isUsedOnThisTick: boolean

    /**
     * 查看该spawn当前tick是否可用
     * @returns
     */
    canUse: boolean

    /**
     * 标记该spawn当前tick被使用
     */
    used(): void

}
