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
        let container = this.getData<StructureContainer>('containerId')
        if (!container) {
            // 寻找附近的container
            const containers = this.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, {
                filter: s => s.structureType == STRUCTURE_CONTAINER
            });

            if (containers.length > 0) {
                // 更新内存并返回找到的第一个container
                container = containers[0]
                this.setData('containerId', container.ref)
            }
        }

        return container
    }

    linkGetter(): StructureContainer | undefined {
        let link = this.getData<StructureContainer>('linkId')
        if (!link) {
            // 寻找附近的link
            const links = this.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 1, {
                filter: s => s.structureType == STRUCTURE_LINK
            });

            if (links.length > 0) {
                // 更新内存并返回找到的第一个link
                link = links[0]
                this.setData('linkId', link.ref)
            }
        }

        return link
    }

}
