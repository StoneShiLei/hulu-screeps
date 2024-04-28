import { PrototypeHelper } from "utils/PrototypeHelper";
import { RoomPositionExtension } from "./prototypes/roomPosition";


export function mountGlobal() {
    try {
        global.LOCAL_SHARD_NAME = Game.shard.name
    } catch (e) {
        global.LOCAL_SHARD_NAME = 'sim'
    }

    PrototypeHelper.assignPrototype(RoomPosition, RoomPositionExtension)
}
