import { RoomExtension } from "roomCache/protos/room";
import { PrototypeHelper } from "utils/PrototypeHelper";


export function mountRoomCache() {
    PrototypeHelper.assignPrototype(Room, RoomExtension)
}
