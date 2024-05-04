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
}
