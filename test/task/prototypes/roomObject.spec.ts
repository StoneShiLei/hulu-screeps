//覆写全局对象，以解决Ext继承未实现的类型
class MockRoomObject { }
(global as any).RoomObject = MockRoomObject

import { mockInstanceOf } from "screeps-jest";
import { RoomObjectExtension } from "task/prototypes/roomObject";

describe('RoomObjectExtension', () => {

    const roomObjExt = mockInstanceOf<RoomObjectExtension>()

    const source = mockInstanceOf<Source>({
        id: "id1",
        get ref() {
            return roomObjExt.refGetter.call(this)
        }
    })

    it('should return the id if present', () => {
        // 模拟 id 属性
        expect(source.ref).toBe('id1');
    });

    // it('should return the name if id is not present but name is', () => {
    //     // 确保 id 未定义，name 被定义
    //     Object.defineProperty(roomObject, 'id', {
    //         value: undefined,
    //         writable: true
    //     });
    //     Object.defineProperty(roomObject, 'name', {
    //         value: 'objectName',
    //         writable: true
    //     });

    //     expect(roomObject.ref).toBe('objectName');
    // });

    // it('should return an empty string if neither id nor name is present', () => {
    //     // 确保 id 和 name 都未定义
    //     Object.defineProperty(roomObject, 'id', {
    //         value: undefined,
    //         writable: true
    //     });
    //     Object.defineProperty(roomObject, 'name', {
    //         value: undefined,
    //         writable: true
    //     });

    //     expect(roomObject.ref).toBe('');
    // });
});
