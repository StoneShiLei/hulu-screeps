import { mountTask } from "./task";
import { ErrorMapper } from "utils/ErrorMapper";
import { LogLevel, Logger, setLogLevel } from "utils/Logger";
import { LOCAL_SHARD_NAME, mountGlobal, SIM_ROOM_NAME } from "global";
import { mountRoomCache } from "roomCache";
import { ErrorCatcher } from "utils/ErrorCatcher";
import { RoomEngine, mountRoomEngine } from "roomEngine";
import { StackAnalysis } from "utils/StackAnalysis";
import { mountSpawnCaster } from "spawnCaster";
import { mountStructure } from "structure";

//设置日志等级
setLogLevel(LogLevel.INFO)
//是否开启堆栈分析
const enableStackAnalysis = false

//挂载全局函数
mountGlobal()
//挂载房间建筑缓存
mountRoomCache()
//挂载任务系统
mountTask()
//挂载spawn系统
mountSpawnCaster()
//挂载业务建筑
mountStructure()
//挂载房间引擎
mountRoomEngine()

//挂载堆栈分析
if (!enableStackAnalysis) StackAnalysis.mount()

//main
function unwarappedLoop(): void {

  ErrorCatcher.catch(() => RoomEngine.run())
  _.values<Creep>(Game.creeps).forEach(creep => ErrorCatcher.catch(() => creep.run()))


  LOCAL_SHARD_NAME != 'sim' ? Game.cpu.generatePixel() : 0
  ErrorCatcher.throwAll()
}


const stackAnalysisloop = LOCAL_SHARD_NAME != SIM_ROOM_NAME ? ErrorMapper.wrapLoop(StackAnalysis.wrap(unwarappedLoop)) : unwarappedLoop
const normalLoop = LOCAL_SHARD_NAME != SIM_ROOM_NAME ? ErrorMapper.wrapLoop(unwarappedLoop) : unwarappedLoop
const loop = enableStackAnalysis ? stackAnalysisloop : normalLoop

export { loop }
