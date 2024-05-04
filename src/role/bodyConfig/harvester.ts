import { BodyPartHelper } from "spawnCaster/helper/BodyPartHelper"

export class HarvesterBodyConfig {
    static sourceHarvester(room: Room): BodyPartConstant[] {
        let maxPartCount = 13

        let currentCost = 0
        let segmentCost = BODYPART_COST[WORK] * 2 + BODYPART_COST[MOVE]
        let segmentsCount = 0
        while (currentCost + segmentCost <= room.energyCapacityAvailable - BODYPART_COST[CARRY] * Math.ceil(segmentsCount / 5)) {
            segmentsCount += 1
            currentCost += segmentCost
            if (segmentsCount >= maxPartCount) break
        }

        let carryPartCount = Math.min(2, Math.ceil(segmentsCount / 5))
        if (segmentsCount > 10 && segmentsCount == maxPartCount) carryPartCount = Math.min(8, 50 - segmentsCount * 3)
        return BodyPartHelper.convertBodyPart({ [WORK]: segmentsCount * 2, [CARRY]: carryPartCount, [MOVE]: segmentsCount })
    }
}
