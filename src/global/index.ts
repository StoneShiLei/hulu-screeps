import { PrototypeHelper } from "utils/PrototypeHelper";
import { RoomPositionExtension } from "./protos/roomPosition";
import { CreepExtension } from "./protos/creep";
import { RoomExtension } from "./protos/room";
import { StackAnalysis } from "utils/StackAnalysis";
import { SourceExtension } from "./protos/source";
import { MineralExtension } from "./protos/mineral";


export function mountGlobal() {
    try {
        global.LOCAL_SHARD_NAME = Game.shard.name
    } catch (e) {
        global.LOCAL_SHARD_NAME = 'sim'
    }
    global.StackAnalysis = StackAnalysis

    PrototypeHelper.assignPrototype(RoomPosition, RoomPositionExtension)
    PrototypeHelper.assignPrototype(Creep, CreepExtension)
    PrototypeHelper.assignPrototype(Room, RoomExtension)
    PrototypeHelper.assignPrototype(Source, SourceExtension)
    PrototypeHelper.assignPrototype(Mineral, MineralExtension)
}
