import { PrototypeHelper } from "utils/PrototypeHelper";
import { CreepExtension } from "./prototypes/creep";
import { RoomObjectExtension } from "./prototypes/roomObject";

export function mountTask(){
    PrototypeHelper.assignPrototype(Creep,CreepExtension)
    PrototypeHelper.assignPrototype(RoomObject,RoomObjectExtension)
}
