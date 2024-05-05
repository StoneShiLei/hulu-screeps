export class SourceExtension extends Source {
    _canHarvest: boolean | undefined

    canHarvestGetter(): boolean {

        if (this._canHarvest) return this._canHarvest

        const energyAvailable = this.energy > 0
        const canWorkPosLen = this.pos.surroundPos(1).filter(pos => pos.isWalkable()).length
        const targetedLen = this.targetedBy.length

        this._canHarvest = energyAvailable && canWorkPosLen * 1.5 - targetedLen > 0
        return this._canHarvest
    }

    containerGetter(): StructureContainer | null {

        this.room.memory.roomObjectData = this.room.memory.roomObjectData || {};
        const data = this.room.memory.roomObjectData[this.id] || {};

        // 尝试通过缓存的id获取container
        if (data.containerId) {
            const container = Game.getObjectById<StructureContainer>(data.containerId);
            if (container) {
                return container;  // 如果有效，则直接返回
            } else {
                // 如果无效（可能被摧毁），则删除无效id
                delete this.room.memory.roomObjectData[this.id].containerId;
            }
        }

        // 寻找附近的container
        const containers = this.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        });

        if (containers.length > 0) {
            // 更新内存并返回找到的第一个container
            data.containerId = containers[0].id;
            this.room.memory.roomObjectData[this.id] = data;
            return containers[0];
        }

        return null;  // 如果没有找到任何container，则返回null
    }

}
