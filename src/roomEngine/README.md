房间驱动
房间内实体（Source、Controller）等按优先级产生任务目标（target）
并按照该优先级为每个目标分配若干符合工作条件的creep
同时指定工作策略函数

Scheduler
任务调度器，产生任务目标
定义了以什么对象，什么条件，筛选出可发布任务的target
用什么策略（strategy）对target进行操作

Action
行为的集合
策略集合是对target操作方法的集合
主要负责
给target分配creep
根据要求spawn新的creep
给creep构造真实可用的task

Event
包含如何处理目标的方法

房间策略
Low:房间能量不到800
Medium:房间能量到达800，但没有storage
High:房间有己方storage

Low不分化creep,所有的creep基本都为worker角色，负责所有运营
Medium开始分化creep,挖运分离
High开始高级房间运营


