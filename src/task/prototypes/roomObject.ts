
export class RoomObjectExtension extends RoomObject {
    refGetter():string{
        if (this.hasId(this)) {
            return this.id;
        } else if (this.hasName(this)) {
            return this.name;
        } else {
            return '';
        }
    }

    private hasId(obj: any): obj is RoomObjectWithId {
        return obj.id !== undefined;
    }

    private hasName(obj: any): obj is RoomObjectWithName {
        return obj.name !== undefined;
    }
}

interface RoomObjectWithId extends RoomObject {
    id: string;
}

interface RoomObjectWithName extends RoomObject {
    name: string;
}
