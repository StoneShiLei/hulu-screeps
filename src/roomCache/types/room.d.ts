interface Room {
    sources: Source[]
    deposits: Deposit[]
    spawns: StructureSpawn[]
    extensions: StructureExtension[]
    roads: StructureRoad[]
    walls: StructureWall[]
    ramparts: StructureRampart[]
    keeperLairs: StructureKeeperLair[]
    portals: StructurePortal[]
    links: StructureLink[]
    towers: StructureTower[]
    labs: StructureLab[]
    containers: StructureContainer[]
    powerBanks: StructurePowerBank[]
    constructionSites: ConstructionSite[]
    observer: StructureObserver | undefined
    powerSpawn: StructurePowerSpawn | undefined
    extractor: StructureExtractor | undefined
    nuker: StructureNuker | undefined
    factory: StructureFactory | undefined
    invaderCore: StructureInvaderCore | undefined
    mineral: Mineral | undefined

    /**
     * 获取当前房间内所有可以进行维修的建筑
     */
    allNeedRepairStructures: Structure[]
    /**
     * 当前房间是否有己方控制器
     */
    my: boolean

    /**
     * 当前房间属于己方的controller等级，如果没有或不属于己方则返回0
     */
    level: number

    /**
     * 获取大容量存储对象数组，按顺序为storage、terminal、factory、containers
     */
    massStores: MassStoresType[]

    /**
     * 获取当前房间所有大容量存储对象中的该资源总数
     * @param type 资源类型
     */
    countResource(type: ResourceConstant): number

    /**
     * Game.getObjectById的别名
     * @param id 对象id
     */
    get<T extends _HasId>(id: Id<T>): T | undefined

    /**
     * 更新房间缓存
     * 删除建筑时会自动更新
     * 新增建筑需要调用此方法
     * 否则建筑不会添加到缓存中
     * @param type 缓存对象类型
     */
    update(type?: CacheObjectType): void
}

type MassStoresType = StructureStorage | StructureTerminal | StructureFactory | StructureContainer
type CacheObjectType =
    STRUCTURE_OBSERVER | STRUCTURE_POWER_SPAWN | STRUCTURE_EXTRACTOR | STRUCTURE_NUKER |
    STRUCTURE_FACTORY | STRUCTURE_SPAWN | STRUCTURE_EXTENSION | STRUCTURE_ROAD | STRUCTURE_WALL |
    STRUCTURE_RAMPART | STRUCTURE_KEEPER_LAIR | STRUCTURE_PORTAL | STRUCTURE_LINK |
    STRUCTURE_TOWER | STRUCTURE_LAB | STRUCTURE_CONTAINER | STRUCTURE_POWER_BANK |
    LOOK_SOURCES | LOOK_DEPOSITS | MassStoresConstantType | STRUCTURE_STORAGE | STRUCTURE_TERMINAL
type MassStoresConstantType = 'massStores'
