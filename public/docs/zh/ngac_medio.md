# NGAC 指南：中等水平

> [!提示]
> 在此级别，静态策略（谁是谁）与动态策略混合，为您提供实时控制。

## 动态策略和授权

与 RBAC 不同，NGAC 中的更改会立即生效，无需重新加载会话或重新分配 JWT 令牌。针对每个关键请求中的集中授权图进行验证。

### 权限评估（策略评估）

为了评估请求是否被批准，NGAC 引擎拦截该请求。

````美人鱼
序列图
    参与者用户作为 Web 客户端
    参与者API作为API网关/代理
    参与者 NGAC 作为 Motor Sentinel-NGAC
    参与者数据库作为数据库
    
    用户->>API：GET /resources/protected/1
    API->>NGAC：用户可以读取对象1吗？
    
    矩形 RGB(20, 50, 40)
        NGAC 注释：评估图 (PDP)
        NGAC-->>NGAC：搜索路径：U -> UA -> OA <- O
    结束
    
    找到替代路径
        NGAC-->>API：200 OK（允许）
        API->>DB：获取数据
        DB-->>API：数据
        API-->>用户：200 OK + 数据
    else 不存在的路径
        NGAC-->>API：403 禁止
        API-->>用户：403禁止
    结束
````

## 策略决策点 (PDP) 和策略执行点 (PEP)
**PEP**（在我们的例子中为请求拦截器）负责停止操作并请求许可。 **PDP** (Sentinel-NGAC) 是导航图表的大脑。

> [!警告]
>

> [!NOTE]
> 白皮书的其余部分保留其原始语言，以保留代码和图表的语法。

 No hardcodees los chequeos de seguridad en la lógica de negocio. Toda autorización debe manejarse limpiamente en el nivel PEP, dejando a los controladores (controllers) libres de lógica de seguridad.
