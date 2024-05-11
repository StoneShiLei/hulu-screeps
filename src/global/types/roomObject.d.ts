interface RoomObject {

    /**
     * 房间内对象的引用，比如name id
     */
    ref: string | undefined

    /**
     * 删除对象数据缓存
     * @param thisRef 对象的ref
     * @param key 缓存key，为空时删除全部
     */
    deleteData(thisRef: string | undefined, key?: keyof RoomObjectData,): void
    /**
     * 设置对象数据缓存
     * @param key 缓存key
     * @param ref 缓存对象的ref
     */
    setData(key: keyof RoomObjectData, ref: string | undefined): void

    /**
     * 获取对象数据缓存的RoomObject(如果存储内容是ref的话)
     * @param key 缓存key
     */
    getDataObj<T extends RoomObject>(key: keyof RoomObjectData): T | undefined

    /**
     * 获取对象数据缓存的原始内容
     * @param key 缓存key
     */
    getData(key: keyof RoomObjectData): string | undefined
}
