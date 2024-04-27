import { RoomExtension } from "roomCache/prototypes/room";
import { PrototypeHelper } from "utils/PrototypeHelper";


export function mountRoomCache() {
    PrototypeHelper.assignPrototype(Room, RoomExtension)
}
