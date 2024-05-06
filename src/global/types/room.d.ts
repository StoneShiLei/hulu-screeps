import { RoomStatusEnum } from "global/protos/room"

declare global {
    interface Room {
        /**
         * 房间状态
         */
        status: RoomStatusEnum
        /**
         * 属于这个房间的所有creep
         */
        _creeps: Creep[]
        /**
         * room.name的hash
         */
        hashCode: number

        /**
         * Game.time + room.hashCode
         */
        hashTime: number
        /**
         * 获取该房间所有的creep，支持按角色分类,按store从高到低排序
         * @param role 角色
         * @param ignoreSpawning 忽略正在spawn中的creep
         */
        creeps(role?: RoleType, ignoreSpawning?: boolean): Creep[]

        /**
         * 获取该房间所有闲置的creep，支持按角色分类,按store从高到低排序
         * @param role 角色
         * @param ignoreSpawning 忽略正在spawn中的creep
         */
        idleCreeps(role?: RoleType, ignoreSpawning?: boolean): Creep[]

    }
}



