import { PrototypeHelper } from "utils/PrototypeHelper";

describe('PrototypeHelper', () => {
    class Source {
        _test: any
        testGetter() { return 'test'; }
        testSetter(value: any) { this._test = value; }
        testFunc() { return 'testFunc'; }
    }

    class Target { }

    const getter = () => 'test';

    it('原型合并', () => {
        PrototypeHelper.assignPrototype(Target, Source);
        const targetInstance = new Target();

        // Test getter
        expect((targetInstance as any).test).toBe('test');

        // Test setter
        (targetInstance as any).test = 'new value';
        expect((targetInstance as any)._test).toBe('new value');

        // Test normal function
        expect((targetInstance as any).testFunc()).toBe('testFunc');
    });

    it('添加getter', () => {
        PrototypeHelper.createGetter(Target, 't', getter);
        const targetInstance = new Target();

        expect((targetInstance as any).t).toBe('test');
    });
});
