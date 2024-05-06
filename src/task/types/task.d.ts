
/**
 * 任务目标
 */
type TargetType = {
    /**
     * 目标引用，name id
     */
    ref: string | undefined,
    /**
     * 目标位置
     */
    pos: RoomPosition
}

/**
 * 原型任务目标
 */
type ProtoTargetType = {
    /**
     * 目标引用，name id
     */
    ref: string
    /**
     * 目标位置
     */
    _pos: ProtoPos
}

/**
 * 原型任务
 */
interface ProtoTask {
    /**
     * 任务名称
     */
    name: string
    /**
     * 执行该任务的creep
     */
    _creep: {
        name: string
    }
    /**
     * 任务目标
     */
    _target: ProtoTargetType
    /**
     * 父原型任务
     */
    _parent: ProtoTask | null
    /**
     * 任务数据
     */
    data: TaskData
    /**
     * 任务选项
     */
    option: TaskOption

}

/**
 * 任务
 */
interface ITask extends ProtoTask {
    /**
     * 任务设置,由具体实现任务子类自定义
     */
    setting: TaskSetting
    /**
     * 原型任务
     */
    proto: ProtoTask
    /**
     * 执行该任务的creep
     */
    creep: Creep
    /**
     * 任务目标
     */
    target: TargetType | null
    /**
     * 目标位置
     */
    targetPos: RoomPosition
    /**
     * 父任务
     */
    parent: ITask | null
    /**
     * 创建子任务，并将子任务分配给当前任务所属的Creep
     * @param newTask 需要被创建为子任务的任务
     * @return {ITask} 返回新创建的子任务
     */
    fork(newTask: ITask): ITask
    /**
     * 移动到任务目标位置
     * @param range 与目标的距离，默认为1
     */
    moveToTarget(range?: number): number

    /**
     * 移动到下一个目标的位置
     */
    moveToNextPos(): number | undefined
    /**
     * 验证任务是否为有效任务
     * 使用isValidTask验证creep状态
     * 使用isValidTarget验证目标状态
     * 如果任务已不可执行，执行finish结束任务
     */
    isValid(): boolean
    /**
     * 当creep已达到目标范围时执行work
     * 否则移动到目标位置
     */
    run(): number
    /**
     * 结束当前任务，并开始执行父任务
     */
    finish(): number
    /**
     * 验证creep的状态是否可继续任务
     */
    isValidTask(): boolean
    /**
     * 验证目标的状态是否可继续任务
     */
    isValidTarget(): boolean
    /**
     * 执行任务动作
     */
    work(): number
}

/**
 * 任务设置,由具体实现任务子类自定义
 */
interface TaskSetting {
    /**
     * 需要到达的目标范围
     */
    targetRange: number

    /**
     * 只执行一次
     */
    oneShot: boolean

    /**
     * 让开路面，不要在路面上执行任务
     */
    workOffRoad: boolean


}
/**
 * 任务选项
 */
interface TaskOption {

    /**
     * 目标范围半径
     */
    targetRange?: number

    /**
     * 移动选项
     */
    moveOptions?: MoveToOpts

    /**
     * 是否无视迷雾
     */
    blind?: boolean

    /**
     * 当前任务结束后是否向父任务目标移动
     */
    moveNextTarget?: boolean

    /**
     * 资源类型
     */
    resourceType?: ResourceConstant

    /**
     * 转移数量
     */
    amount?: number

    /**
     * 签名
     */
    signature?: string;

    /**
     * 跳过energy
     */
    skipEnergy?: boolean
}
/**
 * 目标数据
 */
interface TaskData {
    /**
     * 资源类型
     */
    resourceType?: ResourceConstant
    /**
     * 转移数量
     */
    amount?: number
    /**
     * 签名
     */
    signature?: string;

    /**
     * 跳过energy
     */
    skipEnergy?: boolean
}
/**
 * 原型位置
 */
interface ProtoPos {
    /**
     * 房间x轴
     */
    x: number;
    /**
     * 房间y轴
     */
    y: number;
    /**
     * 房间名称
     */
    roomName: string;
}
