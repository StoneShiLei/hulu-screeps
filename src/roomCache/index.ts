import { PrototypeHelper } from "utils/PrototypeHelper";


const singleList = new Set<string>([
    STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR, STRUCTURE_NUKER,
    STRUCTURE_FACTORY, STRUCTURE_INVADER_CORE, LOOK_MINERALS,
    //STRUCTURE_TERMINAL,   STRUCTURE_CONTROLLER,   STRUCTURE_STORAGE,
]);

const multipleList = new Set<string>([
    STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_WALL,
    STRUCTURE_RAMPART, STRUCTURE_KEEPER_LAIR, STRUCTURE_PORTAL, STRUCTURE_LINK,
    STRUCTURE_TOWER, STRUCTURE_LAB, STRUCTURE_CONTAINER, STRUCTURE_POWER_BANK,
]);

const additionalList = new Set<string>([
    // room[LOOK_*]获取到数组
    LOOK_SOURCES, LOOK_DEPOSITS
]);

const massStores = new Set<string>([
    STRUCTURE_STORAGE, STRUCTURE_TERMINAL, STRUCTURE_FACTORY, STRUCTURE_FACTORY
])

function run() {
    //实现room[id],使用proxy对象替换room原型
    Room.prototype.__proto__ = new Proxy({}, {
        get(_: any, id: string) {
            return Game.getObjectById(id) as unknown as RoomObject
        }
    })



}

function init(this: RoomCacheType, room: Room) {
    const structureTypes = _.groupBy(room.find(FIND_STRUCTURES), s => s.structureType)

    //初始化单实体建筑
    for (const type in structureTypes) {
        if (singleList.has(type)) {
            const id = structureTypes[type][0].id
            this[type] = id
        }
        else {
            this[type] = new Set(structureTypes[type].map(s => s.id))
        }
    }
}

export function mountRoomCache() {
    // PrototypeHelper.assignPrototype(Flag,FlagExtension)
    run()
}
