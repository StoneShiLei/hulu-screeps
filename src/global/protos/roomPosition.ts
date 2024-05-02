export class RoomPositionExtension extends RoomPosition {

    isWalkable(ignoreCreep: boolean = true, ignoreRampartOwner?: string): boolean {

        //无房间视野时直接按地形判断
        if (!Game.rooms[this.roomName]) {
            return new Room.Terrain(this.roomName).get(this.x, this.y) != TERRAIN_MASK_WALL;
        }

        let isWalkable = true;

        //判断建筑类型是否可通过
        const structures = this.lookFor(LOOK_STRUCTURES);
        if (structures.length > 0) {
            isWalkable = structures.every(struct => {
                if (struct.structureType === STRUCTURE_CONTAINER || struct.structureType === STRUCTURE_ROAD) {
                    return true;
                } else if (struct.structureType === STRUCTURE_RAMPART) {
                    const rampart = struct as StructureRampart;
                    return ignoreRampartOwner ? rampart.owner.username === ignoreRampartOwner : (rampart.my || rampart.isPublic);
                }
                return false;
            });
        }

        //判断地形是否为隧道
        const terrains = this.lookFor(LOOK_TERRAIN);
        const isTerrainWalkable = !terrains.includes("wall") || !!structures.length && structures.every(s => s.structureType === STRUCTURE_ROAD);
        isWalkable = isWalkable && isTerrainWalkable;

        //如果不忽略creep且当前位置有creep时，置为false
        if (!ignoreCreep && this.lookFor(LOOK_CREEPS).length != 0) {
            isWalkable = false;
        }

        return isWalkable;
    }

    surroundPos(range: number = 1): RoomPosition[] {
        let positions: RoomPosition[] = [];

        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                if (dx === 0 && dy === 0) continue; // 跳过目标位置本身
                let x = this.x + dx;
                let y = this.y + dy;

                // 确保位置有效（在房间范围内）
                if (x >= 0 && x < 50 && y >= 0 && y < 50) {
                    positions.push(new RoomPosition(x, y, this.roomName));
                }
            }
        }

        return positions;
    }
}
