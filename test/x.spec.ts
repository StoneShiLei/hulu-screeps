import { mockGlobal, mockInstanceOf, mockStructure } from "screeps-jest";

mockGlobal<Game>('Game', {
    time: 123
});

const creep = mockInstanceOf<Creep>({
    moveTo: () => OK,
    store: {
        getFreeCapacity: () => 0
    },
    transfer: () => ERR_NOT_IN_RANGE
});

const spawn = mockStructure(STRUCTURE_SPAWN, {
    hits: 5000,
    hitsMax: 5000
});

describe('xxxx', () => {
    it('可以正常相加', () => {
        const result = testFn(1, 2)
        expect(result).toBe(3)
    });

})

const testFn = function (num1: number, num2: number): number {
    return num1 + num2
}
