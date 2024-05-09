export class StructureContainerExtension extends StructureContainer {

    mountAt(type: keyof MountAtMap): MountAtObjType | undefined
        | undefined {

        const room = this.room
        let mountAtObj = this.getDataObj<MountAtObjType>('mountAt')
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

            //筛选一次，防止controller和storage source等挨得过近，确保返回的是想要的对象,
            //同时筛选已经有container的对象,标记是否已经有挂载过了，原则是给挂载少的对象进行挂载
            const filter = function (obj: MountAtObjType): boolean {
                const isStructure = 'structureType' in obj
                //视为已挂载的则不会被考虑新挂载container上去
                let isMounted = false
                if ('container' in obj) {
                    isMounted = room.containers.filter(c => c.getData('mountAt') == obj.id).length > 0
                }
                else {
                    isMounted = true //storage不挂载container
                }

                return (isStructure ? obj.structureType === type : type === 'source') && !isMounted
            }

            mountAtObjs = mountAtObjs
                .filter(o => filter(o));

            if (mountAtObjs.length > 0) {
                //选择没有挂载container的那个对象进行挂载
                mountAtObjs.sort((a, b) => {
                    let aMountNum = room.links.filter(l => l.getData('mountAt') == a.id).length;
                    let bMountNum = room.links.filter(l => l.getData('mountAt') == b.id).length;

                    // 如果挂载数量相同，则按距离排序
                    if (aMountNum === bMountNum) {
                        let aDistance = this.pos.getRangeTo(a.pos);
                        let bDistance = this.pos.getRangeTo(b.pos);
                        return aDistance - bDistance;  // 距离较近的优先
                    }

                    // 默认按挂载数量排序
                    return aMountNum - bMountNum;
                });
                mountAtObj = mountAtObjs[0]
                this.setData('mountAt', mountAtObj.id)
            }
        }

        return mountAtObj
    }
}
