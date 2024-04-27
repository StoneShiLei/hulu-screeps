
每隔3tick,对应实例发布任务，用优先级确定任务排序
(任务一旦发布，认为该任务是绝对合法的，所以任务合法性由发布方进行判断)

当所有实体发布任务后

每隔3tick,开始检索当前房间当前产生的任务
把任务按优先级排序后进行遍历
给每个任务指派一个符合其要求的creep，

最后得出未指派的任务总数，根据剩余任务，spawn新的creep

!!!!!3级前挖矿，worker进入挖矿位置后一直挖矿，不会停止，其他worker会来pick掉落在地上的能量




manager为颁发任务的对象
比如flag、source、controller、tower、spawn等
发布任务时由manager指定creep的角色


action负责组织任务
如果creep任务状态为闲置，则立刻尝试为creep颁发任务



真实的角色，角色部件组成不同
harvester1 2 3
worker
transporter
center


attker
helther

每个tick执行？


publisher按顺序发布任务（需要按顺序吗）
发布任务加优先级，然后排序

task[]
[{p:3,type:'harvest'},{p:1,type:'build'}]

idleWorkers !!!!!!!每个tick一开始应该先让creep清空自己的store，不然无法继续执行任务

while(idleWorkers.length && tasks.length){
    sourceConsumer(idleWorkers.shift(),task.shift())
    consturctSitConsumer(worker.shift(),task.shift())
}
if(!idleWorkers.length) spawn...


foreach(var source in sources){
    if(source.targetBy.length === 0){
        var task = source.newTask

        task.creepRole = 'harvester'
        task.body = '[work,work,carry,move]'
        task.type = 'harvestTask'
        task.prob = HIGH
        room.task.add(task)
    }

}

room.task.sort(x => x.prob)
foreach(var task in room.task){
    if(task.type == 'harvestTask'){
        var res = harvestAction.handle(task)
        if(res == OK) room.task.remove(task)
    }
}


harvestAction.hanle(task){
    var target = task.target
    var creep = creeps.harvsters.shift
    if(creep,isIdle){
        if (creep.store.energy < creep.store.getCapacity()) {
            creep.task = TaskHelper.harvest(target)
        } else {
            creep.task = TaskHelper.transfer(store)

        }
    }

}
