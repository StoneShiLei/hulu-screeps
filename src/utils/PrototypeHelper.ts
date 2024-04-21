
export class PrototypeHelper {

    /**
     * 把 obj2 的原型合并到 obj1 的原型上
     * 如果原型的键以 Getter 结尾，则将会把其挂载为 getter 属性,Setter同理
     * @param target 要挂载到的对象
     * @param source 要进行挂载的对象
     */
    static assignPrototype(target: {[key: string]: any}, source: {[key: string]: any}) {
        Object.getOwnPropertyNames(source.prototype).forEach(key => {
            if (key.includes('Getter')) {
                Object.defineProperty(target.prototype, key.split('Getter')[0], {
                    get: source.prototype[key],
                    enumerable: false,
                    configurable: true
                })
            } else if (key.includes('Setter')){
                Object.defineProperty(target.prototype, key.split('Setter')[0], {
                    set: source.prototype[key],
                    enumerable: false,
                    configurable: true
                })
            }
            else {
                target.prototype[key] = source.prototype[key]
            }
        })
    }

    /**
     * 给目标类型添加getter
     * @param target
     * @param name
     * @param getter
     */
    static createGetter(target: any, name: string, getter: () => any) {
        Object.defineProperty(target.prototype, name, {
            get: getter,
            enumerable: false,
            configurable: true
        })
    }

    // /**
    //  * 随机id
    //  * @returns
    //  */
    // static randomId():string{
    //     return _.padLeft(Math.ceil(Math.random()*Math.pow(2,32)).toString(16).toLocaleUpperCase(),8,"0")
    // }
}
