
export function run() {

    _.values<Room>(Game.rooms).forEach(room => {
        const hash = Game.time + room.hashCode
        if (hash % 3 != 0) return
        if (!room.my) return

        if (hash % 31) room.update()




    })

}

