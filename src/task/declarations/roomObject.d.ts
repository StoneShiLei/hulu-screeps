interface RoomObject {
	/**
	 * 房间内对象的引用，比如name id
	 */
	ref: string

	/**
	 * 以该实体作为任务目标的Creep
	 */
	targetedBy: Creep[]
}



