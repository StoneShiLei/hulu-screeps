import { GlobalHelper } from "utils/GlobalHelper";

export class RoomObjectExtension extends RoomObject {

    /**
     * get访问器 获取当前实体的id或name
     * @returns
     */
    refGetter(): string | undefined {

        if ('id' in this) {
            return (this as any).id;
        } else if ('name' in this) {
            return (this as any).name;
        } else {
            return undefined;
        }
    }

    setData(key: string, ref: string | undefined): void {
        if (!this.room || !this.ref || !ref) return undefined

        this.room.memory.roomObjectData = this.room.memory.roomObjectData || {};
        const data = this.room.memory.roomObjectData[this.ref] || {};

        data[key] = ref
    }

    getData<T extends RoomObject>(key: string): T | undefined {
        if (!this.room || !this.ref) return undefined

        this.room.memory.roomObjectData = this.room.memory.roomObjectData || {};
        const data = this.room.memory.roomObjectData[this.ref] || {};

        // 尝试通过缓存的id获取对象data
        if (data[key]) {
            const roomObject = GlobalHelper.deref<T>(data[key])
            if (roomObject) {
                return roomObject;  // 如果有效，则直接返回
            } else {
                // 如果无效（可能被摧毁），则删除无效id
                delete this.room.memory.roomObjectData[this.ref][key];
            }
        }

        return undefined;  // 如果没有找到，则返回null
    }
}
