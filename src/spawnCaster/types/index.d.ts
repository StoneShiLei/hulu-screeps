interface BodySetMap {
    [part: string]: number;
}

type BodySetArray = [BodyPartConstant, number][];


type BodyConfigFunc = (room: Room) => BodyPartConstant[]
