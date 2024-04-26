import { mountTask } from "./task";
import { Container } from "typescript-ioc";
import { ErrorMapper } from "utils/ErrorMapper";
import { LogLevel, Logger, setLogLevel } from "utils/Logger";
import { mountGlobal } from "global";
import { TaskHelper } from "task/TaskHelper";

setLogLevel(LogLevel.DEBUG)
mountGlobal()
mountTask()


function unwarappedLoop(): void {

  for (const room of _.values<Room>(Game.rooms)) {
    if (!room.controller || !room.controller.my) continue

    const spawn = room.find(FIND_MY_SPAWNS)?.shift()
    if (spawn) {
      const myCreeps = spawn.room.find(FIND_MY_CREEPS)
      let harvesters = _.filter(myCreeps, creep => creep.name.includes('Harvester'));
      let upgraders = _.filter(myCreeps, creep => creep.name.includes('Upgrader'));

      if (harvesters.length < 2) spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester' + Game.time)
      if (upgraders.length < 2) spawn.spawnCreep([WORK, CARRY, MOVE], 'Upgrader' + Game.time)
    }
  }



  for (const creep of _.values<Creep>(Game.creeps)) {

    if (creep.isIdle && creep.name.includes('Upgrader')) {
      if (creep.store.energy > 0 && creep.room.controller) {
        creep.task = TaskHelper.upgrade(creep.room.controller)
      } else {
        let sources = creep.room.find(FIND_SOURCES)
        let unattendedSource = _.filter(sources, s => s.targetedBy.length == 0).shift()
        if (unattendedSource) {
          creep.task = TaskHelper.harvest(unattendedSource)
        }
        else {
          creep.task = TaskHelper.harvest(sources[0])
        }
      }
    }

    if (creep.isIdle && creep.name.includes('Harvester')) {
      if (creep.store.energy < creep.store.getCapacity()) {
        let sources = creep.room.find(FIND_SOURCES)
        let unattendedSource = _.filter(sources, s => s.targetedBy.length == 0).shift()
        if (unattendedSource) {
          creep.task = TaskHelper.harvest(unattendedSource)
        }
        else {
          creep.task = TaskHelper.harvest(sources[0])
        }
      } else {
        const fillTargets = [
          ..._.filter(Game.spawns, s => s.store.energy < s.store.getCapacity<RESOURCE_ENERGY>()),
          ..._.filter(creep.room.find<StructureExtension>(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } }),
            s => s.store.energy < s.store.getCapacity<RESOURCE_ENERGY>())
        ]

        const target = creep.pos.findClosestByPath(fillTargets)
        if (target) {
          creep.task = TaskHelper.transfer(target)
        }

      }
    }

    creep.run()
  }

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}

const loop = ErrorMapper.wrapLoop(unwarappedLoop)

export {
  loop,
  unwarappedLoop
}
