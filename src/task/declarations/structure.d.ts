interface EnergyStructure extends Structure {
    energy: number;
    energyCapacity: number;
}

interface StoreStructure extends Structure {
    store: StoreDefinition;
    storeCapacity: number;
}
