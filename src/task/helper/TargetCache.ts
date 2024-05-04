

export class TargetCache {
    /**
     * 缓存目标
     * key:ref
     * val:creepName
     */
    targets: {
        [ref: string]: string[]
    }
    tick: number

    constructor() {
        this.targets = {}
        this.tick = Game.time
    }

    /**
     * 构建缓存
     */
    private cacheTargets() {
        this.targets = {};
        //遍历所有的creep，根据其所有的任务目标构建缓存
        for (let creep of _.values<Creep>(Game.creeps)) {
            let task = creep.memory.task
            while (task) {
                if (!this.targets[task._target.ref]) this.targets[task._target.ref] = []

                this.targets[task._target.ref].push(creep.name)
                task = task._parent
            }
        }
    }

    /**
     * 更新缓存
     */
    static assert() {
        //每个tick都更新缓存
        if (!Game.TargetCache || Game.TargetCache.tick != Game.time) {
            Game.TargetCache = new TargetCache()
            Game.TargetCache.build()
        }
    }

    build() {
        this.cacheTargets()
    }
}
