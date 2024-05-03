import { BodyPartHelper } from "spawnCaster/helper/BodyPartHelper"

export class WorkerBodyConfig {
    static lowWorker(room: Room): BodyPartConstant[] {
        let availableEnergy = room.creeps('worker', false) ? room.energyAvailable : room.energyCapacityAvailable;

        // 基本段及其成本
        const basicBodySegment = [WORK, CARRY, MOVE, MOVE];
        const segmentCost = BodyPartHelper.getCost(basicBodySegment);

        let workerBody: BodyPartConstant[] = [];

        // 计算在不超过可用能量的情况下可以添加多少完整段
        for (let numberOfSegments = 0; numberOfSegments < 12; numberOfSegments++) {
            if ((numberOfSegments + 1) * segmentCost > availableEnergy) {
                break;
            }
            workerBody = workerBody.concat(basicBodySegment);
        }

        return workerBody;
    }
    static mediumWorker(room: Room): BodyPartConstant[] {
        let availableEnergy = room.creeps('worker', false).length + room.creeps('carrier', false).length == 0 ?
            room.energyAvailable : room.energyCapacityAvailable;

        // 基本段及其成本
        const basicBodySegment = [WORK, CARRY, MOVE];
        const segmentCost = BodyPartHelper.getCost(basicBodySegment);

        let segmentsCount = 0;

        //计算在不超过可用能量的情况下课添加多少完整段
        for (let i = 1; i * segmentCost <= availableEnergy; i++) {
            if (segmentsCount >= 17) break;
            segmentsCount++;
        }

        const workSegmentsCount = segmentsCount >= 17 ? segmentsCount - 1 : segmentsCount;

        return BodyPartHelper.convertBodyPart({ [WORK]: workSegmentsCount, [CARRY]: segmentsCount, [MOVE]: segmentsCount })
    }
    static highWorker(room: Room): BodyPartConstant[] {
        return []
    }
}
