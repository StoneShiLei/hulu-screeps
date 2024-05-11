

interface ResourceConfig {
    [resource: string]: number
}

interface AllResource {
    updateTime: number
    resource: StoreDefinition
}

export class BusinessTerminal {

    //     static MAX_PIXEL_AMOUNT = 100

    //     static MIN_PIXEL_HAS_CR = 50000000

    /**
     * 全房间资源缓存
     */
    private static All_ROOM_RES: AllResource = {
        updateTime: 0,
        resource: {} as StoreDefinition
    }

    /**
     * storage数量少于多少挂单买入
     */
    private static RES_BUY_AMOUNT_ROOM: ResourceConfig = {}

    /**
     * 价格少于多少挂单买入
     */
    private static RES_BUY_MAX_PRICE_ROOM: ResourceConfig = {}

    /**
     * 全局库存少于多少买入
     */
    private static RES_BUY_MIN_HOLD_ROOM: ResourceConfig = {}

    /**
     * 设置卖的物品的最大值，如无设置按历史算
     */
    private static ON_SALE: ResourceConfig = {}

    /**
     * 房间商品和化合物买入卖出
     * @param room
     * @returns
     */
    static run(room: Room): void {
        if (Game.time % 3 != 0) return
        if (!room.my || !room.terminal || !room.terminal.my) return

        //更新全房间资源缓存
        if (Game.time - 300 > this.All_ROOM_RES.updateTime) {
            this.All_ROOM_RES.updateTime = Game.time
            this.All_ROOM_RES.resource = this.getAllRoomResourceCount()
        }

        if (!Game.market._dealedOrder) Game.market._dealedOrder = {}
        const dealed = Game.market._dealedOrder //已经交易过就跳过

        //能量单价
        const energyPrice = MarketPrice.getResourceHistory(RESOURCE_ENERGY)

        //卖出 todo


        if (room.countResource(RESOURCE_ENERGY) < 80000) return

        //买进
        if (Game.market.credits > 100000) {
            for (const resourceType in this.RES_BUY_AMOUNT_ROOM) {
                const type = resourceType as ResourceConstant

                //不符合买进条件则跳过
                if (room.countResource(type) >= this.RES_BUY_AMOUNT_ROOM[type] ||
                    (this.All_ROOM_RES.resource[type] || 0) >= this.RES_BUY_MIN_HOLD_ROOM[type]) continue

                const sellList = this.getAllOrdersCache(type, ORDER_SELL)

                let minPrice = 1e30
                let minOrder: Order | undefined = undefined

                for (const order of sellList) {
                    if (dealed[order.id]) break

                    if (!order.roomName) continue

                    //订单所需能量
                    const energyCost = Game.market.calcTransactionCost(order.amount, room.name, order.roomName)
                    //订单实际总价 = 能量*能量单价 + 订单可用量*订单单价
                    const totalPrice = energyCost * energyPrice + order.amount * order.price
                    //订单实际单价
                    const price = totalPrice / order.amount
                    if (price < minPrice) {
                        minOrder = order
                        minPrice = price
                    }
                }

                if (!minOrder || minPrice > this.RES_BUY_MAX_PRICE_ROOM[type]) continue

                const buyAmount = Math.min(minOrder.amount, 10000)
                const code = Game.market.deal(minOrder.id, buyAmount, room.name)
                if (code == OK) {
                    console.log(`已购买资源：${type} ${buyAmount} ${minPrice} ${minOrder.id} ${room.name}`)
                    dealed[minOrder.id] = true
                }
                return //交易后直接终止
            }
        }

    }

    /**
     * 自动买入energy depo mineral
     * @returns
     */
    static autoBuy(): void {
        if (Game.time % 100 != 0) return
        _.values<Order>(Game.market.orders).filter(e => !e.remainingAmount).forEach(e => Game.market.cancelOrder(e.id))

        if (Game.shard.name.startsWith("shard")) {
            this.autoBuyEnergy()
        }

        ["U", "L", "K", "Z", "X", "O", "H"].forEach(e => this.autoBuyMineral(e as ResourceConstant));
    }

    /**
     * 自动买入energy
     */
    private static autoBuyEnergy() {
        // 获取所有有能量购买订单的房间名称
        const hasOrderRooms = new Set(_.values<Order>(Game.market.orders).filter(s => s.remainingAmount && s.resourceType == RESOURCE_ENERGY && s.roomName)
            .map(s => s.roomName));

        if (!Memory.market) Memory.market = {};
        const changed: { [roomName: string]: boolean } = {}; // 记录哪些房间的价格已经被修改

        // 获取能量的历史平均价格
        const avg = MarketPrice.getResourceHistory(RESOURCE_ENERGY);
        // 获取当前市场上所有购买能量订单中最高的价格，如果没有订单则使用平均价格
        let maxOrderPrice = _.max(this.getAllOrdersCache(RESOURCE_ENERGY, ORDER_BUY), s => s.price).price;
        maxOrderPrice = maxOrderPrice || avg;

        // 遍历所有能量购买订单
        _.values<Order>(Game.market.orders)
            .filter(s => s.remainingAmount && s.resourceType == RESOURCE_ENERGY && s.type == ORDER_BUY)
            .forEach(s => {
                if (!s.roomName) return;
                const energyCount = Game.rooms[s.roomName].countResource(RESOURCE_ENERGY);
                // 如果房间能量少于200000，则根据能量数量调整价格
                if (energyCount < 200000) {
                    const newPrice = Math.min(s.price * (energyCount > 170000 ? 1.005 : (energyCount > 120000 ? 1.01 : 1.025)), avg * 5);
                    Game.market.changeOrderPrice(s.id, newPrice);
                }
                changed[s.roomName] = true; // 标记房间价格已修改
            });

        // 清理不存在的房间信息
        for (const roomName in Memory.market) {
            if (!Game.rooms[roomName]) delete Game.rooms[roomName];
        }

        // 对于没有现有订单且有终端设施的房间，根据需要创建新的购买订单
        _.values<Room>(Game.rooms).filter(s => !hasOrderRooms.has(s.name) && s.terminal).map(room => {
            const energyCount = room.countResource(RESOURCE_ENERGY);
            const powerCount = room.countResource(RESOURCE_POWER);

            // 如果能量低于阈值，则创建新的购买订单
            if ((energyCount < 230000 && powerCount >= 6000) || energyCount < 200000) {
                const price = Math.min(Memory.market[room.name] || avg, maxOrderPrice * 1.1); // 计算价格，不超过市场最高价的110%
                Game.market.createOrder({
                    type: ORDER_BUY,
                    resourceType: RESOURCE_ENERGY,
                    price: price * (energyCount > 150000 ? 0.90 : 0.94), // 根据能量数量调整价格比例
                    totalAmount: 240000 - energyCount, // 计算需要购买的总量
                    roomName: room.name
                });
            }
        });
    }

    /**
     * 自动买入mineral
     * @param type
     */
    private static autoBuyMineral(type: ResourceConstant) {

    }


    /**
     * 获取订单缓存
     * @param resourceType
     * @param type
     * @returns
     */
    private static getAllOrdersCache(resourceType: ResourceConstant, type: ORDER_BUY | ORDER_SELL) {
        Game.market._orderCache = Game.market._orderCache || {}
        Game.market._orderCache[type] = Game.market._orderCache[type] || {}

        if (!Game.market._orderCache[type][resourceType]) {
            const allOrders = Game.market.getAllOrders({ type, resourceType })
            Game.market._orderCache[type][resourceType] = Game.market._orderCache[type][resourceType] || []
            Game.market._orderCache[type][resourceType].concat(allOrders)
        }

        return Game.market._orderCache[type][resourceType]
    }

    /**
     * 计算全房间的所有资源量
     * @returns 包含全资源类型资源量的store对象
     */
    private static getAllRoomResourceCount(): StoreDefinition {
        const rooms = _.values<Room>(Game.rooms).filter(r => r.storage || r.terminal)
        const result = rooms.reduce((all, room) => {
            const roomStore = {} as StoreDefinition
            if (room.storage) addStore(roomStore, room.storage.store)
            if (room.terminal) addStore(roomStore, room.terminal.store)

            addStore(all, roomStore)
            return all
        }, {} as StoreDefinition)

        return result

        //将两个store对象相加
        function addStore(store: StoreDefinition, targetStore: StoreDefinition): StoreDefinition {
            for (const res in targetStore) {
                const r = res as ResourceConstant
                if (targetStore[r] > 0) {
                    store[r] = (store[r] || 0) + targetStore[r]
                }
            }
            return store
        }
    }

    /**
     * 初始化
     */
    static init() {
        //商品
        ([RESOURCE_BIOMASS, RESOURCE_SILICON, RESOURCE_METAL, RESOURCE_MIST, RESOURCE_WIRE, RESOURCE_ALLOY, RESOURCE_CONDENSATE, RESOURCE_CELL]).forEach(e => {
            this.RES_BUY_MAX_PRICE_ROOM[e] = 0.01
            this.RES_BUY_MIN_HOLD_ROOM[e] = 300000 // 0.3m
            this.RES_BUY_AMOUNT_ROOM[e] = 100000
        });

        // 化合物
        (["O", "L", "H", "X", "K", "Z", "U"]).forEach(e => {
            this.RES_BUY_AMOUNT_ROOM[e] = 12000
            this.RES_BUY_MAX_PRICE_ROOM[e] = 3
            this.RES_BUY_MIN_HOLD_ROOM[e] = 100000 // 0.1m
        });
        this.RES_BUY_MAX_PRICE_ROOM["X"] = 6

        // OPS
        this.RES_BUY_MAX_PRICE_ROOM[RESOURCE_OPS] = 1
        this.RES_BUY_AMOUNT_ROOM[RESOURCE_BATTERY] = 12000
        this.RES_BUY_MIN_HOLD_ROOM[RESOURCE_BATTERY] = 100000 // 0.1m

        // 电池
        // this.RES_BUY_MAX_PRICE_ROOM[RESOURCE_BATTERY] = 5
        // this.RES_BUY_AMOUNT_ROOM[RESOURCE_BATTERY] = 12000
        // this.RES_BUY_MIN_HOLD_ROOM[RESOURCE_BATTERY] = 100000 // 0.1m

        //设置卖的东西的最大值
        this.ON_SALE = function () {
            // if(Game.shard.name == "shard3")return{
            //     [RESOURCE_WIRE]:680,
            //     [RESOURCE_SWITCH]:5530,
            //     [RESOURCE_TRANSISTOR]:32846,
            //     [RESOURCE_MICROCHIP]:146164,
            //     [RESOURCE_CIRCUIT]:332871,
            //     [RESOURCE_DEVICE]:776503,
            // };
            // if(Game.shard.name == "Screeps.Cc")return{
            //     [RESOURCE_CIRCUIT]:19000,
            //     [RESOURCE_HYDRAULICS]:19000,
            //     [RESOURCE_EMANATION]:19000,
            //     [RESOURCE_ORGANOID]:19000,
            // };
            return {}
        }()
    }
}



export class MarketPrice {

    /**
     * 获取资源平均价格
     * @param type
     */
    static getResourceHistory(type: ResourceConstant) {
        const list = this.getHistory(type)
        const history = list.length && list.filter(e => !(e.stddevPrice > e.avgPrice && e.stddevPrice >= 1)) //排除有些人挂单换cr
        if (!history) return 0
        return _.sum(history.map(e => e.avgPrice)) / history.length || 10 //平均值
    }

    /**
     * 获取市场历史
     * @param type
     * @returns
     */
    private static getHistory(type: ResourceConstant) {
        return Game.market.getHistory(type) || []
    }
}


BusinessTerminal.init()
