interface RoomMemory {
    /**
     * 房间的hashCode
     */
    hashCode: number
    /**
     * 房间的对象缓存，用于给没有memory的对象快捷访问memory
     */
    roomObjectData: {
        [id: string]: any
    }
}
