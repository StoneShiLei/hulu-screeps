import { BodyPartHelper } from "spawnCaster/helper/BodyPartHelper"

export class CarrierBodyConfig {
    static carrier(room: Room): BodyPartConstant[] {

        let body = [CARRY, CARRY, MOVE];
        let cost = BodyPartHelper.getCost(body)
        let segmentsCount = 0
        for (let i = 1; i * cost <= room.energyCapacityAvailable; i++) {
            if (segmentsCount >= 17) break;
            segmentsCount += 1
        }
        return BodyPartHelper.convertBodyPart({ [CARRY]: segmentsCount < 17 ? segmentsCount : segmentsCount * 2 - 1, [MOVE]: segmentsCount })
    }
}
