import { BodyPartHelper } from "spawnCaster/helper/BodyPartHelper"

export class UpgraderBodyConfig {
    static upgrader(room: Room): BodyPartConstant[] {

        if (room.level == 8 && room.extensions.length >= 20) {
            //boost
        }

        let maxPartCount = 16

        let currentCost = 0
        let segmentCost = BODYPART_COST[WORK] * 2 + BODYPART_COST[MOVE]
        let segmentsCount = 0
        while (currentCost + segmentCost <= room.energyCapacityAvailable - BODYPART_COST[CARRY] * Math.ceil(segmentsCount / 5)) {// 超过 10个 work 加一个 carry
            segmentsCount += 1
            currentCost += segmentCost
            if (segmentsCount >= maxPartCount) break
        }

        let sum = 0  //16的时候溢出，多两个 carry
        if (segmentsCount == maxPartCount) {
            segmentsCount -= 1
            sum = 2
        }

        let carryPartCount = Math.ceil(segmentsCount / 5) + sum
        return BodyPartHelper.convertBodyPart({ [WORK]: segmentsCount * 2, [CARRY]: carryPartCount, [MOVE]: segmentsCount })
    }
}
