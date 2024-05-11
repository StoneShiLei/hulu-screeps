interface MoveToOpts {
    /**
     * 是否绕过敌人的creep，默认为true
     */
    bypassHostileCreeps?: boolean

    /**
     * 无视swamp与road的移动损耗
     * 用于方便pc和眼
     * 默认false
     */
    ignoreSwamps?: boolean

    /**
     * 被creep挡路绕路时的绕路半径，默认为5
     */
    bypassRange?: number

    /**
     * 寻得的路是不完全路径时的再次寻路延迟，默认为10
     */
    noPathDelay?: number
}
