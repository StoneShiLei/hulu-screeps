import { Container } from "typescript-ioc"
import { GlobalHelper } from "utils/GlobalHelper"
import { Logger } from "utils/Logger"
import { Task } from "../task"

const log = Container.get(Logger)

/**
 * 任务构造器映射
 */
const taskMap = new Map<string, Function>();

/**
 * 定义任务构造器类型
 */
interface TaskConstructor<T extends TargetType> {
    new(target: T, options?: TaskOption): Task<T>;
    createInstance: (target: T, options?: TaskOption) => Task<T>;
    taskName: string;
}

/**
 * 任务注册装饰器，强制任务必须实现静态方法createInstance
 * @returns
 */
export function TaskRegistration<T extends TargetType>() {
    return function (constructor: TaskConstructor<T>) {
        if (!constructor.createInstance) {
            throw new Error(`类型 ${constructor.name} 必须实现 static createInstance 方法.`);
        }

        if (!constructor.taskName) {
            throw new Error(`类型 ${constructor.name} 必须实现 static taskName 属性.`);
        }

        if (taskMap.get(constructor.taskName)) {
            throw new Error(`taskName ${constructor.taskName} 声明重复.`);
        }
        else {
            // 注册任务类构造器
            taskMap.set(constructor.taskName, constructor.createInstance);
        }

    };
}

/**
 * 初始化任务
 * @param protoTask 原型任务
 * @returns
 */
export function initTask(protoTask: ProtoTask): Task<TargetType> {
    let taskName = protoTask.name
    let target = GlobalHelper.deref(protoTask._target.ref)

    const createInstance = taskMap.get(taskName);

    if (!createInstance) {
        log.logError(`非法任务: ${taskName}! task.creep: ${protoTask._creep.name}. 从memory中删除!`);
        return new TaskInvalid(target);
    }

    const task = createInstance(target);

    task.proto = protoTask

    return task
}

/**
 * 非法任务
 */
class TaskInvalid extends Task<any> {

    static taskName = 'invalid'

    constructor(target: any, options = {} as TaskOption) {
        super('INVALID', target, options);
    }

    isValidTask(): boolean {
        return false
    }
    isValidTarget(): boolean {
        return false
    }
    work(): number {
        return OK
    }

}
