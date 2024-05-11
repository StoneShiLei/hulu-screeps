interface StructureContainer {
    /**
     * 挂载的目标对象
     * @param type
     */
    mountAt(type: keyof MountAtMap): MountAtObjType | undefined
}
