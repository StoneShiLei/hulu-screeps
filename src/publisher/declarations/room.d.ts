interface Room {
    messageQueue: Message[]
}
interface Message {
    type: string,
    priority: number
    target: TargetType
}
