
export class StructureLinkExtension extends StructureLink {

    mountAt(type: keyof MountAtMap): MountAtObjType | undefined
        | undefined {
        let mountAtObj = this.getData<MountAtObjType>('mountAt')
        if (!mountAtObj) {

            // 寻找附近对象
            let mountAtObjs: MountAtObjType[] = []
            if (type == 'source') {
                mountAtObjs = this.pos.findInRange(FIND_SOURCES, 2);
            }
            else {
                mountAtObjs = this.pos.findInRange<StructureController | StructureStorage>
                    (FIND_STRUCTURES, 2, {
                        filter: s => s.structureType == type
                    });
            }

            //筛选一次，防止controller和storage source等挨得过近，确保返回的是想要的对象
            mountAtObjs = mountAtObjs
                .filter(o => ('structureType' in o ? o.structureType === type : type === 'source'));

            if (mountAtObjs.length > 0) {
                // 更新内存并返回找到的第一个对象
                mountAtObj = mountAtObjs[0]
                this.setData('mountAt', mountAtObj.id)
            }
        }

        return mountAtObj
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
}


