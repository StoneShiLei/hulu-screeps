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
    observer: StructureObserver | undefined
    powerSpawn: StructurePowerSpawn | undefined
    extractor: StructureExtractor | undefined
    nuker: StructureNuker | undefined
    factory: StructureFactory | undefined
    invaderCore: StructureInvaderCore | undefined
    mineral: Mineral | undefined

    my: boolean
    level: number

    massStores: MassStoresType[]

    countResource(type: ResourceConstant): number
    get<T extends _HasId>(id: Id<T>): T | undefined
}

type MassStoresType = StructureStorage | StructureTerminal | StructureFactory | StructureContainer


// *  一键呼出房间建筑，含powerBank、deposit、source、mineral
// *  例：creep.room.source; // 得到source的数组
// *      creep.room.spawn; // 得到spawn的数组
// *      creep.room.nuker; // 得到nuker对象
// *  按type取用时一律不加's'
// *  房间唯一建筑取值是对象或者undefined
// *  房间可能有多个的建筑取值是对象数组，长度>=0
// *  缓存存放在local[room.name]，唯一建筑存id, 复数建筑存Set([id])
// *  【重要】拆除建筑会自动移除缓存，新建筑用room.update()更新缓存，不主动调用room.update()则不会识别新建筑
// *  例1：room.mass_stores; // 得到包括此房间所有（按此顺序：）storage、terminal、factory、container的数组
// *  例2：room.deposit; // 得到此房间中deposit数组，注意是数组
// *  例3：room.powerBank; // 得到此房间中powerBank数组，注意是数组
// *  例4：room.powerSpawn; // 得到此房间中powerSpawn对象
// *  例5：room.power; // 得到此房间的mass_stores中所有此类资源的总量（数字）
// *  例6：room[RESOURCE_HYDROXIDE]; // 得到此房间的mass_stores中所有此类资源的总量（数字），参数可以是任意资源类型
// *  例7：room[id];  // 如果此id的建筑存在且在视野中，得到此建筑对象，否则得到undefined，可获取实际位置在其他room的建筑
// *  例8：room.my;  // 等同于 room.controller && room.controller.my
// *  例9：room.level;  // 等同于 room.controller && room.controller.level
