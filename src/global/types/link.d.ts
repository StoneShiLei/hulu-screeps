interface StructureLink {
    mountAt(type: keyof MountAtMap): MountAtObjType | undefined
}
