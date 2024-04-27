import { filter } from "lodash"
import { TaskHelper } from "task/helper/TaskHelper";
import { HarvestTargetType } from "task/instances/task_harvest";
import { UpgradeTargetType } from "task/instances/task_upgrade";

export function mountConsumer() {

    _.each(Game.rooms, room => {
        let tasks = room.messageQueue || []

        const myCreeps = room.find(FIND_MY_CREEPS)
        let workers = _.filter(myCreeps, creep => creep.isIdle); //isIdle store.isempty

        tasks = tasks.sort((a, b) => b.priority - a.priority)
        console.log(JSON.stringify(tasks.map(o => o.type)))
        _.each(tasks, task => {

            const peekCreep = workers[0]
            if (!peekCreep) return
            if (peekCreep.store.getUsedCapacity() == 0) {
                if (task.type == 'harvest1') {
                    sourceConsumer(workers.shift()!, task)
                }

            }
            else {
                if (task.type == 'fillSpawn') {
                    spawnConsumer(workers.shift()!, task)
                }
                else if (task.type == 'upgrade') {
                    controllerConsumer(workers.shift()!, task)
                }
                //build

            }
        })
    })
}

function sourceConsumer(creep: Creep, task: Message) {
    const t = task.target as Source
    console.log(111)
    if ((4 - t.targetedBy.length) > 0) {
        creep.task = TaskHelper.harvest(task.target as HarvestTargetType, { keep: true })
        console.log(2222)
        if (creep.room.find(FIND_MY_CREEPS).length < 8) {
            creep.room.spawns[0].spawnCreep([WORK, CARRY, MOVE], 'Worker' + Game.time)
        }
        //name = LOCAL_SHARD_NAME+"_"+Game.time+"_"+Game._name_hash;// shard+Game.time+第几个生的
    }   //Game._name_hash = (Game._name_hash||0)+1;//防止同一帧冲突名字
}

function spawnConsumer(creep: Creep, task: Message) {
    const fillTargets = [
        ..._.filter(creep.room.spawns, s => s.store.energy < s.store.getCapacity(RESOURCE_ENERGY)),
        ..._.filter(creep.room.extensions, s => s.store.energy < s.store.getCapacity(RESOURCE_ENERGY))
    ]
    const target = creep.pos.findClosestByPath(fillTargets)

    if (target) {
        creep.task = TaskHelper.transfer(target)
    }
}

function controllerConsumer(creep: Creep, task: Message) {
    creep.task = TaskHelper.upgrade(task.target as UpgradeTargetType)
}


