import { BodyPartHelper } from "spawnCaster/helper/BodyPartHelper";

export class RoomExtension extends Room {
    /**
     * 当前tick该房间是否可spawn，此处注意游戏内对象的实例变量每tick重置
     */
    private _isSpawnAvailable: boolean | undefined
    /**
     * 当天tick该房间可用能量，此处注意游戏内对象的实例变量每tick重置
     */
    private _thisTickEnergyAvailable: number | undefined

    /**
     * 尝试spawn一个creep
     * @param role 角色
     * @param bodyConfigFunc 产生bodyConfig的函数 (room) => bodyConfig[]
     * @param task 任务，默认为null
     * @param opt spawn选项
     * @param targetRoomName creep所属房间，默认是spawn所在房间
     */
    trySpawn(role: RoleType, bodyConfigFunc: BodyConfigFunc, task?: ITask, spawnOpt?: SpawnOptions, targetRoomName?: string): string | undefined {
        if (!this || !this.my) return undefined

        if (this._isSpawnAvailable === undefined) this._isSpawnAvailable = true
        if (this._thisTickEnergyAvailable === undefined) this._thisTickEnergyAvailable = this.energyAvailable

        if (!this._isSpawnAvailable) return undefined

        const name = role + this.genName()

        const opts: SpawnOptions = {
            memory: {
                role: role,
                roomName: targetRoomName || this.name,
                task: task || null
            },
            ...spawnOpt
        }

        const body = bodyConfigFunc(this)
        const costs = BodyPartHelper.getCost(body)

        if (this._thisTickEnergyAvailable < costs) {
            this._isSpawnAvailable = false
            return undefined
        }

        const spawn = this.spawns.filter(s => s.canUse).shift()
        if (!spawn) {
            this._isSpawnAvailable = false
            return undefined
        }

        const res = spawn.spawnCreep(body, name, opts)
        if (res !== OK) {
            this._isSpawnAvailable = false
            return undefined
        }

        spawn.used()
        this._thisTickEnergyAvailable -= costs
        return name
    }

    private genName(): string {
        return _.padLeft(Math.ceil(Math.random() * Math.pow(36, 10)).toString(36).toLocaleUpperCase(), 10, "0")
    }
}
