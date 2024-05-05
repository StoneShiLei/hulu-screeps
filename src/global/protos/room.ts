import { RoomStatusEnum } from "global/const/const";


export class RoomExtension extends Room {

    private _roleCreeps: {
        [key: string]: Creep[]
    } | undefined

    idleCreeps(role?: RoleType, ignoreSpawning: boolean = true): Creep[] {
        return this.creeps(role, ignoreSpawning).filter(c => c.isIdle)
    }

    creeps(role?: RoleType, ignoreSpawning: boolean = true): Creep[] {
        if (!this._creeps || !this._creeps.length) {
            initCreepsCache();
            if (!this._creeps || !this._creeps.length) this._creeps = []

        }
        this._roleCreeps = this._roleCreeps || {}
        this._roleCreeps["_creeps"] = this._roleCreeps["_creeps"] || this._creeps

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

    hashTimeGetter(): number {
        return Game.time + this.hashCode
    }

    private hash(str: string) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
        }
        return hash
    }

    statusGetter(): RoomStatusEnum {
        // return RoomStatusEnum.Low
        if (this.energyCapacityAvailable < 800) {
            return RoomStatusEnum.Low
        }
        else if (this.energyCapacityAvailable >= 800 && !this.storage?.my) {
            return RoomStatusEnum.Medium
        }
        else if (this.storage && this.storage.my) {
            return RoomStatusEnum.High
        }
        else {
            return RoomStatusEnum.Low
        }
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
            Game.rooms[roomName]._creeps = creepsByRoom[roomName].sort((a, b) => b.store.getUsedCapacity() - a.store.getUsedCapacity());
        }
    });
}
