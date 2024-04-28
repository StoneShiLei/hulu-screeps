




export class RoomExtension extends Room {

    private _roleCreeps: {
        [key: string]: Creep[]
    } = {}

    creeps(role?: RoleType, ignoreSpawning: boolean = true): Creep[] {
        if (!this._creeps || !this._creeps.length) initCreepsCache();

        const keySuffix = ignoreSpawning ? "_spawned_creeps" : "_creeps";
        const roleKey = role ? role + keySuffix : keySuffix;

        if (role) {
            if (!this._roleCreeps[roleKey]) {
                const filteredCreeps = this._creeps.filter(c => c.memory.role === role);
                this._roleCreeps[role + "_creeps"] = filteredCreeps;
                this._roleCreeps[role + "_spawned_creeps"] = filteredCreeps.filter(c => !c.spawning);
            }
            return this._roleCreeps[roleKey];
        } else {
            if (!this._roleCreeps[keySuffix]) {
                this._roleCreeps["_spawned_creeps"] = this._creeps.filter(c => !c.spawning);
            }
            return this._roleCreeps[keySuffix];
        }
    }

    hashCodeGetter(): number {
        if (!this.memory.hashCode) {
            this.memory.hashCode = (this.hash(this.name) * 9301 + 49297) % 233280
        }
        return this.memory.hashCode
    }

    private hash(str: string) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
        }
        return hash
    }
}

function initCreepsCache(): void {
    const creepsByRoom: { [roomName: string]: Creep[] } = {};

    for (const name in Memory.creeps) {
        const creep = Game.creeps[name];
        if (!creep) {
            delete Memory.creeps[name];
            continue;
        }

        const roomName = creep.memory.roomName;
        creepsByRoom[roomName] = creepsByRoom[roomName] || [];
        creepsByRoom[roomName].push(creep);
    }

    _.keys(creepsByRoom).forEach(roomName => {
        if (Game.rooms[roomName]) {
            Game.rooms[roomName]._creeps = creepsByRoom[roomName];
        }
    });
}
