
export abstract class Scheduler<T extends TargetType> implements IScheduler<T> {
    protected readonly room: Room;
    protected strategy: IRoomStrategy<T> | undefined
    protected readonly role: RoleType

    constructor(room: Room, role: RoleType) {
        this.room = room;
        this.role = role
        this.strategy = this.updateStrategy()
    }

    /**
     * 根据房间状态选取策略
     */
    abstract updateStrategy(): IRoomStrategy<T> | undefined;

    /**
     * 尝试添加event
     */
    tryGenEventToRoom(): void {
        const strategy = this.strategy
        if (!strategy) return
        const targets = strategy.getTargets()
        if (!targets.length) return

        const actionDetail = strategy.getAction()

        const event: Event = {
            action: actionDetail.actionMethod(targets, this.role, this.room, actionDetail.options),
        }

        this.room.eventQueue.push(event)
    }
}
