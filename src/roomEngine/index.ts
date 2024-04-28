
export function run() {

    _.values<Room>(Game.rooms).forEach(room => {
        const hash = Game.time + room.hashCode
        if (hash % 3 != 0) return
        if (!room.my) return

        if (hash % 31) room.update()




    })

}


//发布任务-》根据某条件生成任务，内部自己筛选creep(storeIsEmpty),
//调用
//任务构造器  根据target构造任务


//发布任务时遇到creep数量不够时，发送一个spawn信号  ？

//外部根据定义顺序进行调用
