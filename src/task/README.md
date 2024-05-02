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
if(creep.idle && creep.store.energy == 0){
    creep.task = new harvestTask(source)
} else {
    creep.task = new transferTask(spawn)
}

creep.idle判断creep是否闲置（没有通过验证可执行的任务）
TargetCache用于实时更新每个Target有多少creep以其为目标
TaskRegistry为任务具体实现自动注册
