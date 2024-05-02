

发布器按顺序发布任务
发布任务=生成任务目标+给该目标分配的creep
任务发布器，有筛选creep的方法，有产生任务目标的方法(是emptyStore的creep还是非空creep,是worker还是carrier等)

任务发布器应有3个策略
levelC：房间能量不到800(不分化worker)
levelB: 房间没有my storage(分化出worker,carryier,upgrader)
levelA: 房间有my storage


任务包：
泛型，多个目标，每个目标若干creep
（1目标3creep，意思就是指给3个creep发布同样的任务）

选择creep时就已知是否需要spawn，生成一个spawn请求（tickt
先运行发布器，产生若干任务包，任务包已和顺序无关（在筛选creep时就已经按顺序筛选，顺序实际上只关系到给任务目标分配creep


执行策略：根据taskPackage的策略名称选择要执行的策略

当任务发现creeps不足？
筛选creeps时就要按顺序通知spawn
但此时缺少body
策略会提供body
taskPackage同时带有通知功能





worker先去massStore拿能量，如果不够分配的，就去挖矿

worker全死光或者有工地时，造worker

搬运内矿和掉落资源

剩余空闲empty的woker和carry取出能量，为填充任务做准备

