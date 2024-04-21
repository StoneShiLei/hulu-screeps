import { mountTask } from "./task";
import { Container } from "typescript-ioc";
import { ErrorMapper } from "utils/ErrorMapper";
import { LogLevel, Logger, setLogLevel } from "utils/Logger";

setLogLevel(LogLevel.DEBUG)
mountTask()



export const loop = ErrorMapper.wrapLoop(() => {


  const logger = Container.get(Logger)



  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
    const creep = Game.creeps[name]

    logger.withRoom(creep.room).withCreep(creep).logInfo('Hi')

  }

});
