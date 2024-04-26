import { TargetCache } from "task/helper/TargetCache";


interface PossibleRef {
    id?: string;
    name?: string;
}


export class RoomObjectExtension extends RoomObject {

    /**
     * get访问器 获取当前实体的id或name
     * @returns
     */
    refGetter(this: PossibleRef): string {

        if (this.id) {
            return this.id;
        } else if (this.name) {
            return this.name;
        } else {
            return '';
        }
    }

    targetedByGetter(): Creep[] {
        TargetCache.assert()
        return _.map(Game.TargetCache.targets[this.ref], name => Game.creeps[name])
    }
}


