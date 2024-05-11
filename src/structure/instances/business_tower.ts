export class BusinessTower {

    /**
     * 待修理的建筑列表
     */
    static repairMap: {
        [roomName: string]: string[]
    } = {}

    /**
     * 每个tower待修理的建筑
     */
    static towerRepairMap: {
        [id: string]: string | undefined
    } = {}

    /**
     * 下一次对房间进行check的计时器
     */
    static nextCheckMap: {
        [roomName: string]: number
    } = {}

    /**
     * 上一次攻击的目标
     */
    static beforeAttackMap: {
        [roomName: string]: AnyCreep | undefined
    } = {}

    static run(room: Room): void {

        this.checkSafeMode(room)
        this.checkNeedDefense(room)
        this.updateRepairMapIfNeeded(room)

        //计时器不为0则跳过
        if (this.nextCheckMap[room.name] > 0) {
            this.nextCheckMap[room.name]--;
            return;
        }

        //默认10tick检查一次
        this.nextCheckMap[room.name] = 10

        //如果有入侵者，将检查间隔置为0
        let hostiles = room.find(FIND_HOSTILE_CREEPS)
        if (hostiles.length) {
            this.nextCheckMap[room.name] = 0
            //首先根据两个单位的生命值百分比排序,如果两个单位的生命值百分比相同则根据它们的绝对生命值排序
            hostiles = hostiles.sort((a, b) => a.hits / a.hitsMax != b.hits / b.hitsMax ? (a.hits / a.hitsMax - b.hits / b.hitsMax) : a.hits - b.hits)
        }

        let randomAttackTarget: AnyCreep | undefined = undefined
        let previouslyAttacked = this.beforeAttackMap[room.name];

        room.towers.forEach(tower => {
            //治疗己方掉血creep
            let myCreep: AnyCreep | null = tower.pos.findClosestByRange(FIND_MY_CREEPS, { filter: c => c.hits != c.hitsMax })
            if (!myCreep) myCreep = tower.pos.findClosestByRange(FIND_MY_POWER_CREEPS, { filter: c => c.hits != c.hitsMax })
            if (!hostiles.length && myCreep) {
                tower.heal(myCreep)
                this.nextCheckMap[room.name] = 0
                return
            }

            //攻击入侵单位
            if (hostiles.length > 0) {
                const hostileCreep = hostiles.shift()!;

                // 判断上一次攻击的效果,上一tick攻击的敌人是否被治疗了，如果该目标未受到有效伤害则切换目标
                const lastTickHealable = previouslyAttacked && hostileCreep.id == previouslyAttacked.id && previouslyAttacked.hits <= hostileCreep.hits
                if (!lastTickHealable && hostileCreep.hits !== hostileCreep.hitsMax) {
                    tower.attack(hostileCreep);
                    this.beforeAttackMap[room.name] = hostileCreep;
                    return;
                } //todo  需要修改

                // 每15 ticks随机攻击一个目标，如果已经有随机目标
                if (Game.time % 15 === 0 && randomAttackTarget) {
                    tower.attack(randomAttackTarget);
                    return;
                }

                // 切换一次随机攻击目标
                if (Game.time % 15 === 7) {
                    randomAttackTarget = hostiles[Math.floor(hostiles.length * Math.random())]
                    tower.attack(randomAttackTarget);
                    return;
                }

                tower.attack(hostileCreep)
                return
            }
            else {
                //修理建筑
                let targetId = this.towerRepairMap[tower.id] = this.towerRepairMap[tower.id] || this.repairMap[room.name].shift()
                if (!targetId) return
                let target = Game.getObjectById<Structure>(targetId)
                if (!target || target.hits / target.hitsMax > 0.9) {
                    targetId = this.towerRepairMap[tower.id] = this.repairMap[room.name].shift()
                    if (!targetId) return
                    target = Game.getObjectById<Structure>(targetId)
                }

                if (target) {
                    tower.repair(target)
                    this.nextCheckMap[room.name] = 0
                }
            }
        })
    }

    /**
     * 更新房间维修建筑缓存list
     * @param room
     * @returns
     */
    private static updateRepairMapIfNeeded(room: Room): void {
        if (Game.time % 31 === 0 || !this.repairMap[room.name]) {
            const structuresToRepair = room.allNeedRepairStructures.filter(s =>
                s.hits < s.hitsMax * 0.9 && s.hits < 10000000
            ).sort((a, b) => a.hits - b.hits);

            this.repairMap[room.name] = structuresToRepair.map(s => s.id);
        }
    }

    /**
     * 检测是否需要开启安全模式
     * @param room
     * @returns
     */
    private static checkSafeMode(room: Room): void {
        const hostileCount = room.find(FIND_HOSTILE_CREEPS, {
            filter: c => c.owner.username != "Invader" &&
                c.body.filter(e => e.type == HEAL && e.boost).length >= 5
        }).length

        if (!hostileCount) return

        const myRuinCount = room.find(FIND_RUINS, {
            filter: s => "owner" in s.structure &&
                s.structure.owner?.username == room.controller?.owner?.username &&
                s.structure.structureType != STRUCTURE_RAMPART &&
                s.structure.structureType != STRUCTURE_EXTRACTOR &&
                s.structure.structureType != STRUCTURE_LINK
        }).length

        if (!myRuinCount) return

        room.controller?.activateSafeMode()
    }

    /**
     * 检测是否需要主动防御  todo
     * @param room
     */
    private static checkNeedDefense(room: Room): void {
        //flag
    }
}
