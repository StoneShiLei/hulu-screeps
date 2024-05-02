
export enum Color {
    RED = 'red',
    GREEN = 'green',
    YELLOW = 'yellow',
}

/**
 * 日志等级
 */
export enum LogLevel {
    DEFAULT = 0,
    DEBUG = 1,
    INFO = 2,
    ERR = 3,
    FATAL = 4,
}

/**
 * 全局日志等级
 */
let LOG_LEVEL = LogLevel.INFO

/**
 * 设置全局日志等级
 * @param level 日志等级
 */
export function setLogLevel(level: LogLevel) {
    LOG_LEVEL = level
}

/**
 * 日志帮助类
 */
export class Logger {

    private creep: Creep | undefined
    private room: Room | undefined

    /**
     * 加入creep上下文
     * @param creep
     * @returns
     */
    withCreep(creep: Creep): Logger {
        this.creep = creep
        return this
    }

    /**
     * 加入房间上下文
     * @param room
     * @returns
     */
    withRoom(room: Room): Logger {
        this.room = room
        return this
    }

    /**
     * 打印debug日志
     * @param msg
     */
    logDebug(msg: string) {
        this.log(LogLevel.DEBUG, msg, false, Color.YELLOW)
    }
    /**
     * 打印info日志
     * @param msg
     */
    logInfo(msg: string) {
        this.log(LogLevel.INFO, msg, false)
    }
    /**
     * 打印error日志
     * @param msg
     */
    logError(msg: string) {
        this.log(LogLevel.ERR, msg, false, Color.RED)
    }
    /**
     * 打印error日志 并发送邮件通知
     * @param msg
     */
    logErrorWithNotify(msg: string) {
        this.log(LogLevel.ERR, msg, true, Color.RED)
    }
    /**
     * 发送邮件通知
     * @param msg
     */
    notify(msg: string) {
        this.log(LogLevel.DEFAULT, msg, true, Color.GREEN)
    }

    /**
     * 日志
     * @param logLevel 日志等级
     * @param msg 日志消息
     * @param prefixes 前缀
     * @param notify 是否邮件通知
     * @param color 颜色
     */
    private log(logLevel: LogLevel, msg: string, notify: boolean = false, color?: Color, prefixes: string[] = [`t-${Game.time}`]) {

        switch (logLevel) {
            case LogLevel.DEBUG:
                prefixes.push('DEBUG')
                break;
            case LogLevel.INFO:
                prefixes.push('INFO')
                break;
            case LogLevel.ERR:
                prefixes.push('ERROR')
                break;
            case LogLevel.DEFAULT:
                prefixes.push('NOTIFY')
                break;
        }

        if (this.room) {
            prefixes.push(`R-${this.room.name}`)
        }
        if (this.creep) {
            prefixes.push(`C-${this.creep.name}`)
        }

        let prefix = prefixes.length > 0 ? `[${prefixes.join(' ')}] ` : ''

        //跳过小于全局日志等级的打印和通知
        if (logLevel !== LogLevel.DEFAULT && LOG_LEVEL > logLevel) return

        prefix = this.colorful(prefix, true, color)

        const logMsg = `${prefix} ${msg}`

        if (notify) Game.notify(msg)

        console.log(logMsg)
    }

    /**
     * 文本上色
     * @param content 文本
     * @param bolder 是否加边框
     * @param color 颜色
     * @returns
     */
    private colorful(content: string, bolder: boolean = false, color?: Color): string {
        const colorStyle = color ? `color: ${color};` : ''
        const bolderStyle = bolder ? 'font-weight: bolder;' : ''

        return `<text style="${[colorStyle, bolderStyle].join(' ')}">${content}</text>`
    }
}
