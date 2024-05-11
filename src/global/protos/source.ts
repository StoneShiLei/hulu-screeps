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

    containerGetter(): StructureContainer | undefined {
        const containers = this.room.containers.filter(container => container.mountAt('source')?.id == this.id)
        if (containers.length) return containers[0]
        return undefined
    }

    linksGetter(): StructureLink[] {
        const links = this.room.links.filter(link => link.mountAt('source')?.id == this.id)
        return links
    }

}
