interface Market {
    _dealedOrder: {
        [orderId: string]: boolean
    }
    _orderCache: {
        [orderType: string]: {
            [resType: string]: Order[]
        }
    }
}
