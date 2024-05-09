export class StructureStorageExtension extends StructureStorage {

    linkGetter(): StructureLink | undefined {
        const links = this.room.links.filter(link => link.mountAt('storage')?.id == this.id)
        if (links.length) return links[0]
        return undefined
    }
}
