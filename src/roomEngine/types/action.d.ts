interface IAction {

}

type ActionGenerationType<T extends TargetType = TargetType> = (targets: T[], role: RoleType, room: Room, options?: ActionOptions) => ActionType

type ActionType = () => void


interface ActionOptions {
    resourceType?: ResourceConstant
    amount?: number
}
