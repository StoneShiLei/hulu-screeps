房间驱动
房间内实体（Source、Controller）等按优先级产生任务目标（target）
并按照该优先级为每个目标分配若干符合工作条件的creep
同时指定工作策略函数

Scheduler
任务调度器，根据实体产生任务包（TaskPackage）
定义了以什么对象，什么条件，筛选出可发布任务的target
以符合哪些条件的creep（emptyStore、role）去处理target
用什么策略（strategy）对target进行操作

Strategy
策略的集合，每个任务调度器对应一个策略集合
策略集合是对target操作方法的集合
主要负责根据要求spawn新的creep
给creep构造真实可用的task

TaskPackage
任务包，一个任务包包含了多个target
每个target包含若干creep
同时标记了该任务包所属的room

房间策略
Low:房间能量不到800
Medium:房间能量到达800，但没有storage
High:房间有己方storage

Low不分化creep,所有的creep基本都为worker角色，负责所有运营
Medium开始分化creep,挖运分离
High开始高级房间运营





<!--
worker先去massStore拿能量，如果不够分配的，就去挖矿

worker全死光或者有工地时，造worker

搬运内矿和掉落资源

剩余空闲empty的woker和carry取出能量，为填充任务做准备 -->

