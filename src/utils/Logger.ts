import { InRequestScope, Singleton } from "typescript-ioc"
import { gameTick, now } from "./timeHelper"
import { Color } from "../constants"

/**
 * 日志等级
 */
export enum LogLevel{
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
export function setLogLevel(level:LogLevel){
    LOG_LEVEL = level
}

/**
 * 日志帮助类
 */
@InRequestScope
export class Logger {

    private creep:Creep|undefined
    private room:Room|undefined

    withCreep(creep:Creep):Logger{
        this.creep = creep
        return this
    }

    withRoom(room:Room):Logger{
        this.room = room
        return this
    }

    logDebug(msg:string){
        this.log(LogLevel.DEBUG,msg,false,Color.YELLOW)
    }
    logInfo(msg:string){
        this.log(LogLevel.INFO,msg,false)
    }
    logError(msg:string){
        this.log(LogLevel.ERR,msg,false,Color.RED)
    }
    logErrorWithNotify(msg:string){
        this.log(LogLevel.ERR,msg,true,Color.RED)
    }
    notify(msg:string){
        this.log(LogLevel.DEFAULT,msg,true,Color.GREEN)
    }

    /**
     * 日志
     * @param logLevel 日志等级
     * @param msg 日志消息
     * @param prefixes 前缀
     * @param notify 是否邮件通知
     * @param color 颜色
     */
    private log(logLevel:LogLevel,msg:string,notify:boolean =false,color?:Color,prefixes:string[] = [`${now()}`,`tick-${gameTick()}`]){

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

        if (this.room){
            prefixes.push(`Room:${this.room.name}`)
        }
        if (this.creep){
            prefixes.push(`Creep:${this.creep.name}`)
        }

        let prefix = prefixes.length > 0 ? `[${prefixes.join(' ')}] ` : ''

        //跳过小于全局日志等级的打印和通知
        if(LOG_LEVEL != LogLevel.DEFAULT && LOG_LEVEL > logLevel) return

        prefix = this.colorful(prefix, true,color)

        const logMsg = `${prefix} ${msg}`

        if (notify) Game.notify(logMsg)

        console.log(logMsg)
    }

    /**
     * 文本上色
     * @param content 文本
     * @param bolder 是否加边框
     * @param color 颜色
     * @returns
     */
    private colorful(content:string,bolder:boolean=false,color?:Color):string{
        const colorStyle = color ? `color: ${color};` : ''
        const bolderStyle = bolder ? 'font-weight: bolder;' : ''

        return `<text style="${[ colorStyle, bolderStyle ].join(' ')}">${content}</text>`
    }
}
