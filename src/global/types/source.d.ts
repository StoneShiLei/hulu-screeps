interface Source {
    /**
     * 周围是否有空位可以harvest
     */
    canHarvest: boolean

    /**
     * source旁的container
     */
    container: StructureContainer | undefined

    /**
     * source旁的link
     */
    link: StructureContainer | undefined
}
