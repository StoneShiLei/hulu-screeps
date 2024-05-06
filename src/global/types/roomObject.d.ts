interface RoomObject {

    /**
     * 房间内对象的引用，比如name id
     */
    ref: string | undefined

    /**
     * 设置对象数据缓存
     * @param key 缓存key
     * @param ref 缓存对象的ref
     */
    setData(key: string, ref: string | undefined): void

    /**
     * 获取对象数据缓存的RoomObject
     * @param key 缓存key
     */
    getData<T extends RoomObject>(key: string): T | undefined
}
