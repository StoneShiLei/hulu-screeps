import { PrototypeHelper } from "utils/PrototypeHelper";
import { RoomPositionExtension } from "./protos/roomPosition";
import { CreepExtension } from "./protos/creep";
import { RoomExtension } from "./protos/room";


export function mountGlobal() {
    try {
        global.LOCAL_SHARD_NAME = Game.shard.name
    } catch (e) {
        global.LOCAL_SHARD_NAME = 'sim'
    }

    PrototypeHelper.assignPrototype(RoomPosition, RoomPositionExtension)
    PrototypeHelper.assignPrototype(Creep, CreepExtension)
    PrototypeHelper.assignPrototype(Room, RoomExtension)
}
