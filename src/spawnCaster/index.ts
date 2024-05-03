import { RoomExtension } from "./protos/room";
import { PrototypeHelper } from "utils/PrototypeHelper";
import { StructureSpawnExtension } from "./protos/spawn";


export function mountSpawnCaster() {
    PrototypeHelper.assignPrototype(Room, RoomExtension)
    PrototypeHelper.assignPrototype(StructureSpawn, StructureSpawnExtension)
}
