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

引擎
不按顺序一次调用



事件
不同房间策略有不同的事件
事件具有优先级
运输、挖矿、升级、spawn

定义事件
事件类型指示如何处理事件
harvest
carry
upgrade
spawn

事件的参数：
事件目标
事件处理人数
...


事件触发器和事件是一对多关系


根据房间策略决定是否产生事件
产生事件的优先级：
房间策略定义了事件优先级
根据优先级遍历，调用可产生事件的触发器
得到事件
按事件触发事件handler



产生挖矿任务
产生升级任务
产生搬运任务

接受挖矿任务
接受升级任务
接受搬运任务

生产creep?





调度器 scheduler
传入room，角色  可重复调用
手动创建，显示new，不需要优先级

调度器内创建策略实例，直接调用策略方法
调度器根据房间状态有3种策略
策略决定产生若干优先级的任务包

任务包包含若干目标，目标分配creep数量（默认1），当creep不足以分配时是否需要spawn


fillSpawn()  => [p1(优先级1,carry),p2(优先级3,worker)]

low策略[p1(优先级1,carry)]
m策略[p1(优先级1,carry),p2(优先级3,worker)]




action负责
spawn creep
为任务目标分配creep

3种任务
采集：采矿，捡起资源？
搬运：从a搬运到b，资源不足时装填资源
其他：--


装填资源目标选择：targetedBy=Creep[], currenAmount有creep以此为目标时，根据任务的类型维护当前tick实时资源

可实现：一组目标需要装填时，总装填量-》creep携带量，一次chain







策略  action
组织任务，给需要能量的任务加入取能量的任务
