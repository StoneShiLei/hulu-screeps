interface StructureContainer {
    mountAt(type: keyof MountAtMap): MountAtObjType | undefined
}
