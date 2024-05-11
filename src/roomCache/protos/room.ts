const local: CacheType = {};

export class RoomExtension extends Room {

    _sources: Source[] | undefined
    _deposits: Deposit[] | undefined
    _spawns: StructureSpawn[] | undefined
    _extensions: StructureExtension[] | undefined
    _roads: StructureRoad[] | undefined
    _walls: StructureWall[] | undefined
    _ramparts: StructureRampart[] | undefined
    _keeperLairs: StructureKeeperLair[] | undefined
    _portals: StructurePortal[] | undefined
    _links: StructureLink[] | undefined
    _towers: StructureTower[] | undefined
    _labs: StructureLab[] | undefined
    _containers: StructureContainer[] | undefined
    _powerBanks: StructurePowerBank[] | undefined
    _observer: StructureObserver | undefined
    _powerSpawn: StructurePowerSpawn | undefined
    _extractor: StructureExtractor | undefined
    _nuker: StructureNuker | undefined
    _factory: StructureFactory | undefined
    _invaderCore: StructureInvaderCore | undefined
    _mineral: Mineral | undefined
    _massStores: MassStoresType[] | undefined
    _constructionSites: ConstructionSite[] | undefined

    allNeedRepairStructuresGetter(): Structure[] {
        const single = [this.observer, this.powerSpawn, this.extractor, this.nuker, this.factory]
            .filter((s): s is StructureObserver | StructurePowerSpawn | StructureExtractor | StructureNuker | StructureFactory => s !== undefined)

        return [
            ...single,
            ...this.spawns,
            ...this.extensions,
            ...this.roads,
            ...this.links,
            ...this.towers,
            ...this.labs,
            ...this.containers,
            ...this.massStores,
        ]
    }

    update(type?: CacheObjectType): void {
        if (type == STRUCTURE_STORAGE || type == STRUCTURE_TERMINAL) type = 'massStores'

        //如果没有传递type或不存在缓存，则全量更新缓存
        if (!type || !local[this.name] || !local[this.name].data) {
            init(this)
            return
        }

        //如果包含type，则只更新该type的缓存
        if (type) {
            const cache = local[this.name].data
            const lookTypes = [LOOK_SOURCES, LOOK_DEPOSITS]
            if (type in lookTypes) {
                const t = type as keyof AllLookAtTypes
                const obj = this.lookForAtArea(t, 1, 1, 49, 49, true)
                cache[t] = new Set(obj.map(o => o[t].id))
                return
            }

            if (type === 'massStores') {
                this.update(STRUCTURE_CONTAINER)
                this.update(STRUCTURE_FACTORY)
                cache.massStores = new Set()
                if (this.storage) cache.massStores.add(this.storage.id)
                if (this.terminal) cache.massStores.add(this.terminal.id)
                if (this.factory) cache.massStores.add(this.factory.id)
                if (this.containers) this.containers.forEach(c => cache.massStores.add(c.id))
                return
            }


            const objects = this.find(FIND_STRUCTURES, {
                filter: s => s.structureType == type
            }) || []
            cache[type] = new Set(objects.map(o => o.id))
        }
    }

    get<T extends _HasId>(id: Id<T>): T | undefined {
        return Game.getObjectById(id) || undefined
    }

    countResource(type: ResourceConstant): number {
        local[this.name] = local[this.name] || { data: {}, time: {} }
        local[this.name].time[type] = local[this.name].time[type] || { time: 0, count: 0 }
        const lastFetch = local[this.name].time[type]

        if (lastFetch.time < Game.time) {
            lastFetch.count = this.massStores.reduce((temp, massStore) => temp + massStore.store[type], 0)
            lastFetch.time = Game.time
        }
        return lastFetch.count
    }

    myGetter(): boolean {
        return !!this.controller && this.controller.my
    }

    levelGetter(): number {
        return !!this.containers && this.controller?.level || 0
    }

    constructionSitesGetter(): ConstructionSite[] {
        return this._constructionSites ? this._constructionSites : getCacheMultiple<ConstructionSite>(this, "constructionSites")
    }

    massStoresGetter(): MassStoresType[] {
        return this._massStores ? this._massStores : getCacheMass(this)
    }

    sourcesGetter(): Source[] {
        return this._sources ? this._sources : getCacheMultiple<Source>(this, LOOK_SOURCES)
    }

    depositsGetter(): Deposit[] {
        return this._deposits ? this._deposits : getCacheMultiple<Deposit>(this, LOOK_DEPOSITS)
    }

    spawnsGetter(): StructureSpawn[] {
        return this._spawns ? this._spawns : getCacheMultiple<StructureSpawn>(this, STRUCTURE_SPAWN)
    }

    extensionsGetter(): StructureExtension[] {
        return this._extensions ? this._extensions : getCacheMultiple<StructureExtension>(this, STRUCTURE_EXTENSION)
    }

    roadsGetter(): StructureRoad[] {
        return this._roads ? this._roads : getCacheMultiple<StructureRoad>(this, STRUCTURE_ROAD)
    }

    wallsGetter(): StructureWall[] {
        return this._walls ? this._walls : getCacheMultiple<StructureWall>(this, STRUCTURE_WALL)
    }

    rampartsGetter(): StructureRampart[] {
        return this._ramparts ? this._ramparts : getCacheMultiple<StructureRampart>(this, STRUCTURE_RAMPART)
    }

    keeperLairsGetter(): StructureKeeperLair[] {
        return this._keeperLairs ? this._keeperLairs : getCacheMultiple<StructureKeeperLair>(this, STRUCTURE_KEEPER_LAIR)
    }

    portalsGetter(): StructurePortal[] {
        return this._portals ? this._portals : getCacheMultiple<StructurePortal>(this, STRUCTURE_PORTAL)
    }

    linksGetter(): StructureLink[] {
        return this._links ? this._links : getCacheMultiple<StructureLink>(this, STRUCTURE_LINK)
    }

    towersGetter(): StructureTower[] {
        return this._towers ? this._towers : getCacheMultiple<StructureTower>(this, STRUCTURE_TOWER)
    }

    labsGetter(): StructureLab[] {
        return this._labs ? this._labs : getCacheMultiple<StructureLab>(this, STRUCTURE_LAB)
    }

    containersGetter(): StructureContainer[] {
        return this._containers ? this._containers : getCacheMultiple<StructureContainer>(this, STRUCTURE_CONTAINER)
    }

    powerBanksGetter(): StructurePowerBank[] {
        return this._powerBanks ? this._powerBanks : getCacheMultiple<StructurePowerBank>(this, STRUCTURE_POWER_BANK)
    }

    observerGetter(): StructureObserver | undefined {
        return this._observer ? this._observer : getCacheSingle<StructureObserver>(this, STRUCTURE_OBSERVER)
    }

    powerSpawnGetter(): StructurePowerSpawn | undefined {
        return this._powerSpawn ? this._powerSpawn : getCacheSingle<StructurePowerSpawn>(this, STRUCTURE_POWER_SPAWN)
    }

    extractorGetter(): StructureExtractor | undefined {
        return this._extractor ? this._extractor : getCacheSingle<StructureExtractor>(this, STRUCTURE_EXTRACTOR)
    }

    nukerGetter(): StructureNuker | undefined {
        return this._nuker ? this._nuker : getCacheSingle<StructureNuker>(this, STRUCTURE_NUKER)
    }

    factoryGetter(): StructureFactory | undefined {
        return this._factory ? this._factory : getCacheSingle<StructureFactory>(this, STRUCTURE_FACTORY)
    }

    invaderCoreGetter(): StructureInvaderCore | undefined {
        return this.invaderCore ? this.invaderCore : getCacheSingle<StructureInvaderCore>(this, STRUCTURE_INVADER_CORE)
    }

    mineralGetter(): Mineral | undefined {
        return this._mineral ? this._mineral : getCacheSingle<Mineral>(this, LOOK_MINERALS)
    }
}

/**
 * 获取多实体缓存id的对象数组
 * @param room 当前房间
 * @param type 要获取的缓存id类型
 * @returns
 */
function getCacheMultiple<T extends _HasId>(room: Room, type: string): T[] {
    const cache = local[room.name] && local[room.name].data ? local[room.name].data[type] : init(room)[type]
    if (!cache) return []

    const objs: T[] = []
    cache.forEach(id => {
        const o = Game.getObjectById(id as Id<T>)
        if (o) objs.push(o)
        else cache.delete(id)
    })

    return objs
}

/**
 * 获取单实体缓存id的对象
 * @param room 当前房间
 * @param type 要获取的缓存id类型
 * @returns
 */
function getCacheSingle<T extends _HasId>(room: Room, type: string): T | undefined {
    const cache = local[room.name] && local[room.name].data ? local[room.name].data[type] : init(room)[type]
    if (!cache) return undefined

    const id: string = cache.values().next().value
    const o = Game.getObjectById(id as Id<T>) || undefined

    return o
}

/**
 * 获取大存储缓存id的对象列表
 * @param room 当前房间
 * @returns
 */
function getCacheMass(room: Room): MassStoresType[] {
    const cache = local[room.name] && local[room.name].data ? local[room.name].data['massStores'] : init(room)['massStores']
    if (!cache) return []

    const objs: MassStoresType[] = []
    cache.forEach(id => {
        const o = Game.getObjectById(id as Id<MassStoresType>)
        if (o) objs.push(o)
        else cache.delete(id)
    })

    return objs
}

/**
 * 初始化当前房间的缓存，并加入到local全局变量
 * @param room 当前房间
 * @returns 当前房间的缓存对象
 */
function init(room: Room): RoomCacheType {
    const roomCache: RoomCacheType = {}

    //初始化单实体建筑和多实体建筑
    const structureTypes = _.groupBy(room.find(FIND_STRUCTURES) || [], s => s.structureType)
    for (const type in structureTypes) {
        roomCache[type] = new Set(structureTypes[type].map(s => s.id))
    }

    //查找房间内souce和deposit
    for (const type of [LOOK_SOURCES, LOOK_DEPOSITS]) {
        const obj = room.lookForAtArea(type, 1, 1, 49, 49, true)
        roomCache[type] = new Set(obj.map(o => o[type].id))
    }

    //设置minerals
    const minerals = room.find(FIND_MINERALS)
    roomCache[LOOK_MINERALS] = new Set(minerals.map(o => o.id))

    //大容量存储
    roomCache.massStores = new Set()
    if (room.storage) roomCache.massStores.add(room.storage.id)
    if (room.terminal) roomCache.massStores.add(room.terminal.id)
    if (roomCache[STRUCTURE_FACTORY] && roomCache[STRUCTURE_FACTORY].size) roomCache.massStores.add(roomCache[STRUCTURE_FACTORY].values().next().value)
    if (roomCache[STRUCTURE_CONTAINER]) roomCache[STRUCTURE_CONTAINER].forEach(id => roomCache.massStores.add(id))

    //建筑工地
    roomCache.constructionSites = new Set(room.find(FIND_CONSTRUCTION_SITES).map(s => s.id))


    local[room.name] = { data: roomCache, time: {} }
    return local[room.name].data
}

// const singleList = new Set<string>([
//     STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR, STRUCTURE_NUKER,
//     STRUCTURE_FACTORY, STRUCTURE_INVADER_CORE, LOOK_MINERALS,
//     //STRUCTURE_TERMINAL,   STRUCTURE_CONTROLLER,   STRUCTURE_STORAGE,
// ]);

// const multipleList = new Set<string>([
//     STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_WALL,
//     STRUCTURE_RAMPART, STRUCTURE_KEEPER_LAIR, STRUCTURE_PORTAL, STRUCTURE_LINK,
//     STRUCTURE_TOWER, STRUCTURE_LAB, STRUCTURE_CONTAINER, STRUCTURE_POWER_BANK,
// ]);

// const additionalList = new Set<string>([
//     LOOK_SOURCES, LOOK_DEPOSITS
// ]);
