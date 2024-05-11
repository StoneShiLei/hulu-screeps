interface RoomObject {

	/**
	 * 以该实体作为任务目标的Creep
	 */
	targetedBy: Creep[]

	/**
	 * 获取该对象的store内的资源，包括进行中的任务对其取用的值
	 * 如果该对象没有store，则返回undefined
	 * @param type 资源类型
	 */
	getCurrentStoreResource(type?: ResourceConstant): number | undefined
}



