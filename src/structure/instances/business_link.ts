export class BusinessLink {


    static run(room: Room): void {
        if (room.hashTime % 3 != 0) return

        const upgradeLink = room.controller?.link
        const centerLink = room.storage?.link
        let toUpgrade = false
        let toCenter = false
        const minFreeCapacity = 100

        room.sources.forEach(source => {
            //选择符合条件的sourceLink
            let link1 = source.links[0]
            let link2 = source.links[1]
            if (link1 && link2 && (link1.store.getFreeCapacity(RESOURCE_ENERGY) > minFreeCapacity || link1.cooldown)) {
                link1 = link2
            }
            if (!link1) return

            const canTransfer = link1.store.getFreeCapacity(RESOURCE_ENERGY) <= minFreeCapacity
            if (!canTransfer) return

            //先尝试向upgradeLink传递
            if (upgradeLink && canTransfer && upgradeLink.store.energy == 0) {
                link1.transferEnergy(upgradeLink)
                toUpgrade = true
            }

            //然后尝试向centerLink传递
            if (centerLink && canTransfer && centerLink.store.energy == 0 && !toUpgrade) {
                const container = source.container
                const linkAllFull = source.links.filter(l => l.store.energy == 800).length >= 2
                if (container && container.store.energy > (linkAllFull ? 0 : 800)) {
                    link1.transferEnergy(centerLink)
                    toCenter = true
                }
            }
        })

        //为了节省操作tick，尝试一次从centerLink到upgradeLink的传递
        if (!toUpgrade && !toCenter && upgradeLink && upgradeLink.store.energy == 0 && centerLink && centerLink.store.energy != 0) {
            centerLink.transferEnergy(upgradeLink)
        }
    }
}
