import { mountTask } from "./task";
import { Container } from "typescript-ioc";
import { ErrorMapper } from "utils/ErrorMapper";
import { LogLevel, Logger, setLogLevel } from "utils/Logger";
import { mountGlobal } from "global";
import { TaskHelper } from "task/TaskHelper";

setLogLevel(LogLevel.DEBUG)
mountGlobal()
mountTask()



export const loop = ErrorMapper.wrapLoop(() => {


  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
    const creep = Game.creeps[name]

    // logger.withRoom(creep.room).withCreep(creep).logInfo('Hi')

    //creep.task = TaskHelper.havest(target)
    //creep.task = TaskHeper.chain([TaskHelper.havest(target),transform...])

    if(creep.isIdle){
      if (creep.carry.energy < creep.carryCapacity) {
        creep.task = TaskHelper.harvest(creep.room.find(FIND_SOURCES)[1])
      } else {
        let spawn = Game.spawns['Spawn1'];
        creep.task = TaskHelper.transfer(spawn);
      }

    }

    creep.run()
  }

});
