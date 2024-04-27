任务设计

核心思想是“在满足条件 Z 之前对事物 Y 执行操作 X”

满足条件 Z：任务执行者和任务目标当前的状态可以进行任务操作
事物 Y：任务目标
操作 X: 任务行为

结束任务的方式：
1.赋予任务执行者一个新的任务
2.使用finish方法，以父任务替换当前任务，如果父任务不存在，则为null

执行者接近目标的方式：
当执行者对目标执行操作，返回值为不在范围内
则向目标进行移动

用例：
harvest && transfer：
if(creep容量富裕 && source存量富裕){
    creep.task = new harvestTask()
} else {
    creep.task = new transferTask()
}

任务组织：
任务只是单一原子操作，仍然需要角色来进行多个任务之间的组织

任务分发：
以结构实体为中心，向角色分发任务
controller分发upgrade角色任务
spawn分发填入任务
source分发采集任务
storage等容器分发搬运任务


