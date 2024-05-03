interface Creep {
    isEmptyStore: boolean
    role: RoleType
}

type RoleType = "worker" | "carrier" | "upgrader" | "basicDefender"
