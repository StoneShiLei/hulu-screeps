export class BodyPartHelper {
    static convertBodyPart(bodySet: BodySetMap | BodySetArray): BodyPartConstant[] {
        // 检查 bodySet 是否为数组
        if (Array.isArray(bodySet)) {
            let ls: BodyPartConstant[] = [];
            bodySet.forEach(e => {
                for (let i = 0; i < e[1]; i++) {
                    if (Array.isArray(e[0])) {
                        // 如果 e[0] 仍然是数组，则递归调用 calcBodyPart
                        ls.push(...BodyPartHelper.convertBodyPart(e[0] as unknown as BodySetArray));
                    } else {
                        ls.push(e[0]);
                    }
                }
            });
            return ls;
        } else {
            // 把身体配置项拓展成如下形式的二维数组
            // [ [ TOUGH ], [ WORK, WORK ], [ MOVE, MOVE, MOVE ] ]
            const bodys = Object.keys(bodySet).map(type => Array((bodySet as any)[type]).fill(type));
            // 把二维数组展平
            return ([] as BodyPartConstant[]).concat(...bodys);
        }
    }
}
