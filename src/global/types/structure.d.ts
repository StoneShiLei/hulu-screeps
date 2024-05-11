/**
 * 用于声明有store对象的建筑
 */
interface StoreStructure extends Structure {

    /**
     * store对象
     */
    store: StoreDefinition;
}

/**
 * mountAt定义
 */
interface MountAtDefinitions {
    source: Source
    storage: StructureStorage
    controller: StructureController
    extractor: StructureExtractor
}

/**
 * link和container的依赖对象key
 */
type MountAtKeyType = keyof MountAtDefinitions

/**
 * link和container的依赖对象
 */
type MountAtObjType = MountAtDefinitions[MountAtKeyType]

// 自动生成映射类型
type MountAtMap = {
    [K in MountAtKeyType]: MountAtDefinitions[K];
};
