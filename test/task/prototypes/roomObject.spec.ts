//覆写全局对象，以解决Ext继承未实现的类型
class MockRoomObject { }
(global as any).RoomObject = MockRoomObject

import { mockInstanceOf } from "screeps-jest";
import { RoomObjectExtension } from "task/prototypes/roomObject";

describe('RoomObjectExtension', () => {

    const roomObjExt = mockInstanceOf<RoomObjectExtension>({
        refGetter: RoomObjectExtension.prototype.refGetter
    })

    it('should return the id if present', () => {
        const source = mockInstanceOf<Source>({
            id: "id1",
            get ref() {
                return roomObjExt.refGetter.call(this)
            }
        })
        // 模拟 id 属性
        expect(source.ref).toBe('id1');
    });

    it('should return the name if id is not present but name is', () => {
        const flag = mockInstanceOf<Flag>({
            name: "name1",
            get ref() {
                return roomObjExt.refGetter.call(this)
            }
        })
        // 确保 id 未定义，name 被定义
        expect(flag.ref).toBe('name1');
    });

    it('should return an empty string if neither id nor name is present', () => {
        const someObj = {
            name: undefined,
            id: undefined,
            get ref() {
                return roomObjExt.refGetter.call(this)
            }
        }

        expect(someObj.ref).toBe('');
    });
});
