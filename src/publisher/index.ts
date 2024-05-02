// import { filter } from "lodash"
// import { TaskHelper } from "task/helper/TaskHelper";
// import { BuildTargetType } from "task/instances/task_build";
// import { HarvestTargetType } from "task/instances/task_harvest";
// import { TransferTargetType } from "task/instances/task_transfer";
// import { UpgradeTargetType } from "task/instances/task_upgrade";

// export function mountConsumer() {


// }
// const countbusy: {
//     [roomName: string]: number
// } = {}
// export function runConsumer() {
//     _.each(Game.rooms, room => {
//         let tasks = room.messageQueue
//         if (!tasks || !tasks.length) return

//         const myCreeps = room.find(FIND_MY_CREEPS)
//         let workers = _.filter(myCreeps, creep => creep.isIdle); //isIdle store.isempty

//         tasks = tasks.sort((a, b) => b.priority - a.priority)
//         console.log(JSON.stringify(tasks.map(o => o.type)))

//         const emptyCreep = workers.filter(x => x.store.getUsedCapacity() == 0)
//         const noemptyCreep = workers.filter(x => x.store.getUsedCapacity() != 0)

//         console.log('idle empty worker :' + workers.filter(x => x.store.getUsedCapacity() == 0).length)
//         console.log('idle noempty worker :' + workers.filter(x => x.store.getUsedCapacity() != 0).length)

//         // 使用for循环来处理任务，直到tasks为空
//         for (let i = 0; i < tasks.length; i++) {
//             let task = tasks[i];
//             if (task.type == 'pickup') {
//                 pickupConsumer(emptyCreep.shift(), task);
//             } else if (task.type == 'harvest2') {
//                 sourceConsumer(emptyCreep.shift(), task);
//             } else if (task.type == 'fillSpawn') {
//                 spawnConsumer(noemptyCreep.shift(), task);
//             } else if (task.type == 'upgrade') {
//                 controllerConsumer(noemptyCreep.shift(), task);
//             } else if (task.type == 'build') {
//                 buildConsumer(noemptyCreep.shift(), task);
//             }

//             if (!task.canRepeat) {
//                 // 移除已经分配的任务
//                 tasks.splice(i, 1);
//                 i--; // 因为数组长度减少了1，所以索引也要相应减少1
//             }
//         }

//         countbusy[room.name] = countbusy[room.name] || 0
//         if (noemptyCreep.length + emptyCreep.length == 0) {
//             countbusy[room.name]++
//         }
//         else {
//             countbusy[room.name] = 0
//         }
//         if (countbusy[room.name] > 2) {
//             const res = room.spawns[0].spawnCreep([WORK, CARRY, MOVE, WORK], 'Worker' + Game.time)
//             if (res == OK) countbusy[room.name] == 0
//         }
//         //let base36 = Math.pow(36,10)
//         //randomId = ()=>_.padLeft(Math.ceil(Math.random()*base36).toString(36).toLocaleUpperCase(),10,"0")


//         // if ((4 - t.targetedBy.length) > 0) {
//         //randomId = ()=>_.padLeft(Math.ceil(Math.random()*base36).toString(36).toLocaleUpperCase(),10,"0")
//         //     //name = LOCAL_SHARD_NAME+"_"+Game.time+"_"+Game._name_hash;// shard+Game.time+第几个生的
//         // }   //Game._name_hash = (Game._name_hash||0)+1;//防止同一帧冲突名字
//     })
// }

// function pickupConsumer(creep: Creep | undefined, task: Message) {
//     if (!creep) return
//     const t = task.target as Resource[]
//     const target = creep.pos.findClosestByPath(t.filter(x => x.amount != 0))

//     creep.task = TaskHelper.pickup(target as Resource)
// }

// function sourceConsumer(creep: Creep | undefined, task: Message) {
//     if (!creep) return
//     creep.task = TaskHelper.harvestConstant(task.target[0] as HarvestTargetType)

// }

// function spawnConsumer(creep: Creep | undefined, task: Message) {
//     if (!creep) return
//     const target = creep.pos.findClosestByPath(task.target)

//     if (target) {
//         creep.task = TaskHelper.transfer(target as TransferTargetType)
//     }
// }

// function controllerConsumer(creep: Creep | undefined, task: Message) {
//     if (!creep) return
//     creep.task = TaskHelper.upgrade(task.target[0] as UpgradeTargetType)
// }

// function buildConsumer(creep: Creep | undefined, task: Message) {
//     if (!creep) return
//     const target = creep.pos.findClosestByPath(task.target)
//     if (target) {
//         creep.task = TaskHelper.build(target as BuildTargetType)
//     }
// }


