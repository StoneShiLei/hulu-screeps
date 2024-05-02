import { mountTask } from "./task";
import { Container } from "typescript-ioc";
import { ErrorMapper } from "utils/ErrorMapper";
import { LogLevel, Logger, setLogLevel } from "utils/Logger";
import { mountGlobal } from "global";
import { mountRoomCache } from "roomCache";
import { ErrorCatcher } from "utils/ErrorCatcher";


setLogLevel(LogLevel.INFO)
mountGlobal()
mountRoomCache()
mountTask()

const log = Container.get(Logger)


function unwarappedLoop(): void {

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }


  for (const creep of _.values<Creep>(Game.creeps)) {
    ErrorCatcher.catch(creep.run)

    if (creep.hasValidTask) {
      creep.say(creep.task?.name || '???')
    }
  }



  if (global.LOCAL_SHARD_NAME != 'sim') {
    Game.cpu.generatePixel()
  }

  ErrorCatcher.throwAll()
}

const loop = global.LOCAL_SHARD_NAME != 'sim' ? ErrorMapper.wrapLoop(unwarappedLoop) : unwarappedLoop

export {
  loop,
  unwarappedLoop
}
