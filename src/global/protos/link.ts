import { GlobalHelper } from "utils/GlobalHelper";

export class StructureLinkExtension extends StructureLink {

    mountAt(type: keyof MountAtMap): MountAtObjType | undefined
        | undefined {

        let mountAtObj = this.getDataObj<MountAtObjType>('mountAt')
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

            const room = this.room

            // //筛选id是否相等，同时删除失效目标的缓存
            // const f = function (a: StructureLink, b: string) {
            //     //挂载目标的ref
            //     const aMountAtRef = a.getData('mountAt')
            //     if (!aMountAtRef) return false
            //     return aMountAtRef == b
            // }

            //筛选一次，防止controller和storage source等挨得过近，确保返回的是想要的对象,
            //同时筛选已经有link的对象，或已经有2个link的source,标记是否已经有挂载过了，原则是给挂载少的对象进行挂载
            const filter = function (obj: MountAtObjType): boolean {
                const isStructure = 'structureType' in obj

                //视为已挂载的则不会被考虑新挂载link上去
                let isMounted = false
                const mountNum = room.links.filter(l => l.getData('mountAt') == obj.id).length
                if (isStructure && 'link' in obj) {
                    isMounted = mountNum > 0
                } else if (!isStructure && 'links' in obj) {
                    isMounted = mountNum >= 2
                }
                else {
                    isMounted = true //extractor不挂载link
                }

                return (isStructure ? obj.structureType === type : type === 'source') && !isMounted
            }

            mountAtObjs = mountAtObjs.filter(o => filter(o));

            if (mountAtObjs.length > 0) {
                //选择挂载link 最少 最近 的那个对象进行挂载
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

                // 选取排序后的第一个对象进行挂载
                if (mountAtObjs.length > 0) {
                    mountAtObj = mountAtObjs[0];
                    this.setData('mountAt', mountAtObj.id);
                }
                mountAtObj = mountAtObjs[0]
                this.setData('mountAt', mountAtObj.id)

                //清理一次无效的mountAt缓存
                for (let i in this.room.memory.roomObjectData) {
                    const cache = this.room.memory.roomObjectData[i]
                    if (cache.mountAt == mountAtObj.ref) {
                        const o = GlobalHelper.deref(i)
                        if (!o) this.deleteData(i)
                    }
                }
            }
        }

        return mountAtObj
    }
}


