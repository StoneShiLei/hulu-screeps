export class StructureControllerExtension extends StructureController {

    containerGetter(): StructureContainer | undefined {
        const containers = this.room.containers.filter(container => container.mountAt('controller')?.id == this.id)
        if (containers.length) return containers[0]
        return undefined
    }

    linkGetter(): StructureLink | undefined {
        const links = this.room.links.filter(link => link.mountAt('controller')?.id == this.id)
        if (links.length) return links[0]
        return undefined
    }
}
