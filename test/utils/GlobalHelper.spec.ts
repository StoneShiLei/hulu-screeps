import { mockGlobal, mockInstanceOf } from "screeps-jest";
import { GlobalHelper } from "utils/GlobalHelper";

const creep = mockInstanceOf<Creep>({
    id: 'creep_id1',
    name: 'creep1'
})
const flag = mockInstanceOf<Flag>({
    name: 'flag1'
})
const spawn = mockInstanceOf<StructureSpawn>({
    id: 'spawn_id1',
    name: 'spawn1'
})
const source = mockInstanceOf<Source>({
    id: 'source_id1'
})

describe('GlobalHelper', () => {

    describe('deref', () => {

        it('应根据id查找对象', () => {
            mockGlobal<Game>('Game', {
                getObjectById: jest.fn().mockReturnValue(source)
            })
            const result = GlobalHelper.deref('source_id1');
            expect(!!result).toBeTruthy();
            expect(Game.getObjectById).toHaveBeenCalledWith('source_id1');
        });

        it('应根据name查找Creep', () => {
            mockGlobal<Game>('Game', {
                getObjectById: jest.fn().mockReturnValue(undefined),
                creeps: {
                    [creep.name]: creep
                },
                flags: new Proxy({}, {
                    get: () => undefined
                }),
                spawns: new Proxy({}, {
                    get: () => undefined
                }),
            });
            Game.getObjectById = jest.fn().mockReturnValue(undefined);
            const result = GlobalHelper.deref('creep1');
            expect(result).toBe(creep);
        });

        it('应根据id查找Creep', () => {
            mockGlobal<Game>('Game', {
                creeps: {
                    creep
                }
            });
            Game.getObjectById = jest.fn().mockReturnValue(creep);
            const result = GlobalHelper.deref('creep_id1');
            expect(result).toBe(creep);
        });

        it('应根据name查找Flag', () => {
            mockGlobal<Game>('Game', {
                getObjectById: jest.fn().mockReturnValue(undefined),
                flags: {
                    [flag.name]: flag
                },
                creeps: new Proxy({}, {
                    get: () => undefined
                }),
                spawns: new Proxy({}, {
                    get: () => undefined
                }),
            });

            const result = GlobalHelper.deref('flag1');
            expect(result).toBe(flag);
        });

        it('应根据name查找Spawn', () => {
            mockGlobal<Game>('Game', {
                getObjectById: jest.fn().mockReturnValue(undefined),
                spawns: {
                    [spawn.name]: spawn
                },
                creeps: new Proxy({}, {
                    get: () => undefined
                }),
                flags: new Proxy({}, {
                    get: () => undefined
                }),
            });
            Game.getObjectById = jest.fn().mockReturnValue(undefined);
            const result = GlobalHelper.deref('spawn1');
            expect(result).toBe(spawn);
        });

        it('应在找不到对象时返回null', () => {
            mockGlobal<Game>('Game', {
                getObjectById: jest.fn().mockReturnValue(undefined),
                creeps: new Proxy({}, {
                    get: () => undefined
                }),
                flags: new Proxy({}, {
                    get: () => undefined
                }),
                spawns: new Proxy({}, {
                    get: () => undefined
                })
            });
            const result = GlobalHelper.deref('unknown');
            expect(result).toBeNull();
        });
    });

    describe('deRoomPosition', () => {

        it('应创建RoomPosition对象', () => {
            const protoPos = { x: 10, y: 5, roomName: 'E1S1' };

            const result = GlobalHelper.deRoomPosition(protoPos)
            expect(result.x).toBe(10);
            expect(result.y).toBe(5);
            expect(result.roomName).toBe('E1S1');
        });
    });
});
