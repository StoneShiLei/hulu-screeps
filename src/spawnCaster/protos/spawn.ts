export class StructureSpawnExtension extends StructureSpawn {

    /**
     * 当前tick此spawn是否已被使用，此处注意游戏内对象的实例变量每tick重置
     */
    _used: boolean | undefined

    /**
     * 当前tick是否已被使用
     * @returns
     */
    isUsedOnThisTickGetter(): boolean {
        return this._used !== undefined || this._used === true
    }



    /**
     * 查看该spawn当前tick是否可用
     * @returns
     */
    canUseGetter(): boolean {
        return !this.isUsedOnThisTick && !this.spawning && this.isActive()
    }

    /**
     * 标记该spawn当前tick被使用
     */
    used(): void {
        this._used = true
    }
}
