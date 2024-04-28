import { PrototypeHelper } from "utils/PrototypeHelper";
import { RoomPositionExtension } from "./prototypes/roomPosition";
import { CreepExtension } from "./prototypes/creep";


export function mountGlobal() {
    try {
        global.LOCAL_SHARD_NAME = Game.shard.name
    } catch (e) {
        global.LOCAL_SHARD_NAME = 'sim'
    }

    PrototypeHelper.assignPrototype(RoomPosition, RoomPositionExtension)
    PrototypeHelper.assignPrototype(Creep, CreepExtension)
}
