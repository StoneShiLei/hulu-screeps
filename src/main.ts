import { mountTask } from "./task";
import { Container } from "typescript-ioc";
import { ErrorMapper } from "utils/ErrorMapper";
import { LogLevel, Logger, setLogLevel } from "utils/Logger";
import { mountGlobal } from "global";
import { TaskHelper } from "task/helper/TaskHelper";
import { mountRoomCache } from "roomCache";
import { mountPublisher, runPublisher } from "publisher";
import { mountConsumer, runConsumer } from "consumer";


setLogLevel(LogLevel.INFO)
mountGlobal()
mountRoomCache()
mountTask()
mountPublisher()
mountConsumer()

const log = Container.get(Logger)


function unwarappedLoop(): void {

  // for (const room of _.values<Room>(Game.rooms)) {
  //   if (!room.controller || !room.controller.my) continue

  //   const spawn = room.find(FIND_MY_SPAWNS)?.shift()
  //   if (spawn) {
  //     const myCreeps = spawn.room.find(FIND_MY_CREEPS)
  //     let harvesters = _.filter(myCreeps, creep => creep.name.includes('Harvester'));
  //     let upgraders = _.filter(myCreeps, creep => creep.name.includes('Upgrader'));
  //     let builders = _.filter(myCreeps, creep => creep.name.includes('Builder'));
  //     let testers = _.filter(myCreeps, creep => creep.name.includes('Tester'));

  //     if (harvesters.length < 1) spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester' + Game.time)
  //     if (upgraders.length < 1) spawn.spawnCreep([WORK, CARRY, MOVE], 'Upgrader' + Game.time)

  //     const sites = room.find(FIND_CONSTRUCTION_SITES)
  //     if (builders.length < 1 && sites.length) {
  //       spawn.spawnCreep([WORK, CARRY, MOVE], 'Builder' + Game.time)
  //     }

  //     if (testers.length < 3) spawn.spawnCreep([WORK, CARRY, MOVE], 'Tester' + Game.time)

  //     // room['']
  //   }
  // }

  runPublisher()

  runConsumer()


  for (const creep of _.values<Creep>(Game.creeps)) {

    // if (creep.isIdle && creep.name.includes('Builder')) {
    //   const sites = creep.room.find(FIND_CONSTRUCTION_SITES)
    //   if (creep.store.energy > 0 && sites.length) {
    //     const closestSite = creep.pos.findClosestByPath(sites)
    //     if (closestSite) creep.task = TaskHelper.build(closestSite)
    //   } else {
    //     let sources = creep.room.find(FIND_SOURCES)
    //     let unattendedSource = _.filter(sources, s => s.targetedBy.length == 0).shift()
    //     if (unattendedSource) {
    //       creep.task = TaskHelper.harvest(unattendedSource)
    //     }
    //     else {
    //       const closestSource = creep.pos.findClosestByPath(sources)
    //       creep.task = TaskHelper.harvest(closestSource || sources[0])
    //     }
    //   }
    // }

    // if (creep.isIdle && creep.name.includes('Upgrader')) {
    //   if (creep.store.energy > 0 && creep.room.controller) {
    //     creep.task = TaskHelper.upgrade(creep.room.controller)
    //   } else {
    //     let sources = creep.room.find(FIND_SOURCES)
    //     let unattendedSource = _.filter(sources, s => s.targetedBy.length == 0).shift()
    //     if (unattendedSource) {
    //       creep.task = TaskHelper.harvest(unattendedSource)
    //     }
    //     else {
    //       const closestSource = creep.pos.findClosestByPath(sources)
    //       creep.task = TaskHelper.harvest(closestSource || sources[0])
    //     }
    //   }
    // }

    // if (creep.isIdle && creep.name.includes('Harvester')) {
    //   if (creep.store.energy < creep.store.getCapacity()) {
    //     let sources = creep.room.find(FIND_SOURCES)
    //     let unattendedSource = _.filter(sources, s => s.targetedBy.length == 0).shift()
    //     if (unattendedSource) {
    //       creep.task = TaskHelper.harvest(unattendedSource)
    //     }
    //     else {
    //       const closestSource = creep.pos.findClosestByPath(sources)
    //       creep.task = TaskHelper.harvest(closestSource || sources[0])
    //     }
    //   } else {
    //     const fillTargets = [
    //       ..._.filter(Game.spawns, s => s.store.energy < s.store.getCapacity(RESOURCE_ENERGY)),
    //       ..._.filter(creep.room.find<StructureExtension>(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } }),
    //         s => s.store.energy < s.store.getCapacity(RESOURCE_ENERGY))
    //     ]

    //     const target = creep.pos.findClosestByPath(fillTargets)

    //     if (target) {
    //       creep.task = TaskHelper.transfer(target)
    //     }

    //   }
    // }

    creep.run()
    if (creep.hasValidTask) {
      creep.say(creep.task?.name || '???')
    }
  }

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  if (global.LOCAL_SHARD_NAME != 'sim') {
    Game.cpu.generatePixel()
  }

}

const loop = global.LOCAL_SHARD_NAME != 'sim' ? ErrorMapper.wrapLoop(unwarappedLoop) : unwarappedLoop

export {
  loop,
  unwarappedLoop
}
