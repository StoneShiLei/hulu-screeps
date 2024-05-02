import { ConstructSitePublisher } from "./instances/constructSitePublisher"
import { ControllerPublisher } from "./instances/controllerPublisher"
import { PickupPublisher } from "./instances/pickupPublisher"
import { SourcePublisher } from "./instances/sourcePublisher"
import { SpawnPublisher } from "./instances/spawnPublisher"

export function mountPublisher() {

}

export function runPublisher() {
    for (const room of _.values<Room>(Game.rooms)) {
        if (Game.time % 3 != 0) return
        room.messageQueue = []
        new PickupPublisher().publish(room)
        new SourcePublisher().publish(room)
        new ControllerPublisher().publish(room)
        new SpawnPublisher().publish(room)
        new ConstructSitePublisher().publish(room)
    }
}
