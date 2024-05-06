export class MineralExtension extends Mineral {

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
}
