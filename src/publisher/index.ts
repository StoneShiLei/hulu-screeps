import { ControllerPublisher } from "./instances/controllerPublisher"
import { SourcePublisher } from "./instances/sourcePublisher"
import { SpawnPublisher } from "./instances/spawnPublisher"

export function mountPublisher() {
    for (const room of _.values<Room>(Game.rooms)) {
        new SourcePublisher().publish(room)
        new ControllerPublisher().publish(room)
        new SpawnPublisher().publish(room)
    }
}

// export function sourcePublisher(room: Room) {
//     for (const source of room.sources) {
//         room.task = room.task || []
//         room.task.push({ target: source, role: 'harvester', prob: 1 })
//     }
// }

// export function roomTaskHandler(room: Room) {
//     //room.task.sort() prob
//     const harvestTaks = _.filter(room.task, t => t.role === 'harvester')
//     roleAction(harvestTaks, room)
// }

// export function roleAction(tasks: any[], room: Room) {
//     const creeps = _.filter(Game.creeps, c => c.room.name == room.name && c.name.includes('Harvester') && c.isIdle)


//     //如果没有符合条件的creep，则立刻(或统计)生成一个spawn任务 (spawn内部靠name去重)
//     // body: [WORK, CARRY, MOVE]
//     //相隔tick生成唯一id  roomName+targetId+roleActionName
//     //停止生成任务的条件：creep达到指定数量同时也没有闲置的
//     //没达到数量就继续生产creep
//     //可工作位置*1.5 - 以此为目标的creep   Math.min(6,Math.ceil(tCont) > 0)  给creep分配任务 or 生成creep
//     //strategy
//     while (creeps.length && tasks.length) {
//         const peek = creeps[0]
//         if (peek.store.energy < peek.store.getCapacity()) {
//             const task = tasks.shift()
//             peek.task = TaskHelper.harvest(task.target)
//             creeps.shift()
//         }
//         else {
//             const targets = [
//                 ...room.spawns.filter(x => x.store.energy < x.store.getCapacity(RESOURCE_ENERGY)),
//                 ...room.extensions.filter(x => x.store.energy < x.store.getCapacity(RESOURCE_ENERGY)),
//             ]
//             const target = peek.pos.findClosestByPath(targets)
//             if (target) {
//                 peek.task = TaskHelper.transfer(target)
//                 creeps.shift()
//             }

//         }
//     }
// }
