import { mockGlobal, mockInstanceOf } from "screeps-jest";
import { Logger, LogLevel, setLogLevel } from "utils/Logger";

mockGlobal<Game>('Game', {
    time: 123,
    notify: () => undefined
});

const creep = mockInstanceOf<Creep>({
    name: 'someCreep'
});
const room = mockInstanceOf<Room>({
    name: 'W7S7'
})

describe('Logger', () => {
    beforeEach(() => {
        // Reset log level to INFO before each test
        setLogLevel(LogLevel.INFO);
    });

    it('创建实例', () => {
        const logger = new Logger();
        expect(logger).toBeInstanceOf(Logger);
    });

    it('打印INFO日志', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const logger = new Logger();
        logger.logInfo('Test info message');

        // 检查输出是否包含 "INFO" 和 "Test info message"
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('INFO'));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test info message'));

        consoleSpy.mockRestore();
    });

    it('打印Error日志', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const logger = new Logger();
        logger.logError('Test error message');

        // 检查输出是否包含 "INFO" 和 "Test info message"
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test error message'));

        consoleSpy.mockRestore();
    });

    it('打印Error日志和邮件通知', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const logger = new Logger();
        logger.logErrorWithNotify('Test error message');

        // 检查输出是否包含 "INFO" 和 "Test info message"
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test error message'));
        expect(Game.notify).toHaveBeenCalledWith('Test error message');
        consoleSpy.mockRestore();
    });

    it('打印Debug日志', () => {
        setLogLevel(LogLevel.DEBUG);
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const logger = new Logger();
        logger.logDebug('Test debug message');

        // 检查输出是否包含 "INFO" 和 "Test info message"
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('DEBUG'));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test debug message'));

        consoleSpy.mockRestore();
    });

    it('当日志级别为INFO及以上不应打印DEBUG日志', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const logger = new Logger();
        logger.logDebug('Test debug message');

        expect(consoleSpy).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it('应包含Room和Creep上下文', () => {

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        const logger = new Logger().withCreep(creep).withRoom(room);

        logger.logInfo('Context test');

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('R-W7S7 C-someCreep'));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Context test'));

        consoleSpy.mockRestore();
    });

    it('应发送邮件通知', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        const logger = new Logger();
        logger.notify('Notification test');

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Notification test'));
        expect(Game.notify).toHaveBeenCalledWith('Notification test');

    });
});
