export class StructureContainerExtension extends StructureContainer {

    mountAt(type: keyof MountAtMap): MountAtObjType | undefined
        | undefined {
        let mountAtObj = this.getData<MountAtObjType>('mountAt')
        if (!mountAtObj) {

            // 寻找附近对象
            let mountAtObjs: MountAtObjType[] = []
            if (type == 'source') {
                mountAtObjs = this.pos.findInRange(FIND_SOURCES, 1);
            }
            else {
                mountAtObjs = this.pos.findInRange<StructureController | StructureStorage>
                    (FIND_STRUCTURES, 1, {
                        filter: s => s.structureType == type
                    });
            }

            //筛选一次，防止controller和storage source等挨得过近，确保返回的是想要的对象
            mountAtObjs = mountAtObjs.filter(o => {
                if ('structureType' in o && o.structureType == type) { //controller | storage
                    return true
                }
                else if (!('structureType' in o) && type == 'source') { // source
                    return true
                }
                else {
                    return false
                }
            })

            if (mountAtObjs.length > 0) {
                // 更新内存并返回找到的第一个对象
                this.setData('mountAt', mountAtObjs[0].ref)
            }
        }

        return mountAtObj
    }
}
