export class MineralExtension extends Mineral {

    containerGetter(): StructureContainer | null {
        if (!this.room) return null
        this.room.memory.roomObjectData = this.room.memory.roomObjectData || {}
        const data = this.room.memory.roomObjectData[this.id] || {}
        if (data) return Game.getObjectById<StructureContainer>(data.containerId)

        const containers = this.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_CONTAINER })
        if (containers.length) data.containerId = containers[0].id

        this.room.memory.roomObjectData[this.id] = data
        return data
    }
}
