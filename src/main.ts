import { mountTask } from "./task";
import { ErrorMapper } from "utils/ErrorMapper";
import { LogLevel, Logger, setLogLevel } from "utils/Logger";
import { mountGlobal } from "global";
import { mountRoomCache } from "roomCache";
import { ErrorCatcher } from "utils/ErrorCatcher";
import { RoomEngine, mountRoomEngine } from "roomEngine";
import { StackAnalysis } from "utils/StackAnalysis";
import { mountSpawnCaster } from "spawnCaster";
import { mountStructure } from "structure";

setLogLevel(LogLevel.INFO)
mountGlobal()
mountRoomCache()
mountTask()
mountSpawnCaster()
mountStructure()
mountRoomEngine()

function unwarappedLoop(): void {

  ErrorCatcher.catch(() => RoomEngine.run())
  _.values<Creep>(Game.creeps).forEach(creep => ErrorCatcher.catch(() => creep.run()))


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
