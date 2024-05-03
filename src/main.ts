import { mountTask } from "./task";
import { ErrorMapper } from "utils/ErrorMapper";
import { LogLevel, Logger, setLogLevel } from "utils/Logger";
import { mountGlobal } from "global";
import { mountRoomCache } from "roomCache";
import { ErrorCatcher } from "utils/ErrorCatcher";
import { RoomEngine } from "roomEngine";
import { StackAnalysis } from "utils/StackAnalysis";

// console.log('init!!')
setLogLevel(LogLevel.INFO)
mountGlobal()
mountRoomCache()
mountTask()


function unwarappedLoop(): void {

  ErrorCatcher.catch(() => RoomEngine.run())

  for (const creep of _.values<Creep>(Game.creeps)) {

    ErrorCatcher.catch(() => creep.run())

    if (creep.hasValidTask) {
      // creep.say(creep.task?.name || '???')
    }
  }



  if (global.LOCAL_SHARD_NAME != 'sim') {
    Game.cpu.generatePixel()
  }

  ErrorCatcher.throwAll()
}

const loop = global.LOCAL_SHARD_NAME != 'sim' ? ErrorMapper.wrapLoop(StackAnalysis.wrap(unwarappedLoop)) : unwarappedLoop
// const loop = global.LOCAL_SHARD_NAME != 'sim' ? ErrorMapper.wrapLoop(unwarappedLoop) : unwarappedLoop


export {
  loop,
  unwarappedLoop
}
