declare namespace NodeJS {
    interface Global {
        BetterMove: BetterMove
    }

    interface BetterMove {
        /**
         * 更新房间内路径
         * @param roomName
         */
        deletePathInRoom(roomName: string): void

        /**
         * 获取性能信息
         */
        print(): void
    }

}


