import { PrototypeHelper } from "utils/PrototypeHelper";
import { CreepExtension } from "./protos/creep";
import { RoomObjectExtension } from "./protos/roomObject";

export function mountTask() {
    PrototypeHelper.assignPrototype(Creep, CreepExtension)
    PrototypeHelper.assignPrototype(RoomObject, RoomObjectExtension)
}
