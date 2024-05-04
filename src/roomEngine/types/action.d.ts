interface IAction {

}

type ActionGenerationType<T extends TargetType = TargetType> = (targets: T[], role: RoleType, room: Room) => ActionType

type ActionType = () => void
