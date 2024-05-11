export class StructureExtractorExtension extends StructureExtractor {

    containerGetter(): StructureContainer | undefined {
        const containers = this.room.containers.filter(container => container.mountAt('extractor')?.id == this.id)
        if (containers.length) return containers[0]
        return undefined
    }
}
