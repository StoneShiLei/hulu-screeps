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
        this.room.memory.roomObjectData = this.room.memory.roomObjectData || {}
        const data = this.room.memory.roomObjectData[this.id] || {}
        if (data) return Game.getObjectById<StructureContainer>(data.containerId)

        const containers = this.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_CONTAINER })
        if (containers.length) data.containerId = containers[0].id

        this.room.memory.roomObjectData[this.id] = data
        return data
    }
}
