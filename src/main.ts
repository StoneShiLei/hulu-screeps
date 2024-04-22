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


  const logger = Container.get(Logger)



  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
    const creep = Game.creeps[name]

    // logger.withRoom(creep.room).withCreep(creep).logInfo('Hi')

    //creep.task = TaskHelper.havest(target)
    //creep.task = TaskHeper.chain([TaskHelper.havest(target),transform...])

    if(creep.isIdle){
      creep.task = TaskHelper.harvest(creep.room.find(FIND_SOURCES)[0])
    }

    creep.run()
  }

});
