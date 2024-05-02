export class CreepExtension extends Creep {
    isEmptyStoreGetter(): boolean {
        return this.store.getUsedCapacity() === 0
    }
    roleGetter(): RoleType {
        return this.memory.role
    }
}
