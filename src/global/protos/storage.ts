export class StructureStorageExtension extends StructureStorage {

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
