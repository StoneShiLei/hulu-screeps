

export class TargetCache {
    targets: {
        [ref: string]: string[]
    }
    tick: number

    constructor() {
        this.targets = {}
        this.tick = Game.time
    }

    private cacheTargets() {
        this.targets = {};
        for (let creep of _.values<Creep>(Game.creeps)) {
            let task = creep.memory.task
            while (task) {
                if (!this.targets[task._target.ref]) this.targets[task._target.ref] = []

                this.targets[task._target.ref].push(creep.name)
                task = task._parent
            }
        }
    }

    static assert() {
        if (!(Game.TargetCache && Game.TargetCache.tick == Game.time)) {
            Game.TargetCache = new TargetCache()
            Game.TargetCache.build()
        }
    }

    build() {
        this.cacheTargets()
    }
}
