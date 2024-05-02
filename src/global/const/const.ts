/**
 * 房间状态枚举
 */
export enum RoomStatusEnum {
    /**
     * 房间可用能量低于800
     */
    Low = 10,
    /**
     * 房间可用能量高于800，但无己方storage
     */
    Medium = 20,
    /**
     * 有己方storage
     */
    High = 30,
}
