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

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  // runPublisher()

  // runConsumer()


  for (const creep of _.values<Creep>(Game.creeps)) {
    creep.run()
    if (creep.hasValidTask) {
      creep.say(creep.task?.name || '???')
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
