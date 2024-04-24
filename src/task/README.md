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
    creep.harvest()
} else {
    creep.transfer()
}

任务组织：
任务只是单一原子操作，仍然需要角色来进行多个任务之间的组织

任务分发：
以结构实体为中心，向角色分发任务
controller分发upgrade角色任务
spawn分发填入任务
source分发采集任务
storage等容器分发搬运任务


细节：

调用creep.run()时，执行任务

creep的memory包含一个task任务，通过父节点串联任务链

task对象包含
task名称
target名称
target位置
parent父任务

taskData  资源类型 amount数量等  对特殊任务有用的额外数据，比如signature，

taskOpt 其他配置，比如允许无视野目标blind，移动选项moveOptions、当有父任务时去向下一个位置nextPos
taskSetting 对任务的设定，比如是否需要从road上移开不要挡路、目标范围


task对象还应该有一些额外方法

每个tick循环开始
各个任务发布者对闲置（idle，是否有有效的任务）的creep发布任务

creep.run时，自检当前是否有任务，有的话task.run()
task.run()
如果在工作范围内，work()
不在范围内，移动到目标附近



isvalid 检查当前任务和目标是否可用
validTask 检查接任务的目标是否可执行任务
validTarget 检查目标是否可被执行任务


