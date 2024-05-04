interface Creep {
    role: RoleType
}

type RoleType = "worker" | "carrier" | "upgrader" | "basicDefender" | "sourceConstantHarvester"
