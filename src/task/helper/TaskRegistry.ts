import { GlobalHelper } from "utils/GlobalHelper"
import { Task } from "../task"

/**
 * 任务构造器映射
 */
export const taskMap = new Map<string, Function>();

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
