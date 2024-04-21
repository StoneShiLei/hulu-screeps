任务设计

核心“在满足条件 Z 之前对事物 Y 执行操作 X”

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
