# NGAC 指南：基础级别

> [!重要]
> 要掌握 NGAC，您必须首先了解其基本构建模块。每个元素都是授权图中的一个节点。

## 核心元素（基本核心）

NGAC 基于 5 种主要元素类型：

1. **U（用户）：** 请求访问的实体。
2. **O（对象）：** 受保护的资源（文件、数据库记录、URL）。
3. **UA（用户属性）：** 用户组（例如角色、部门或职位）。
4. **OA（对象属性）：** 对象分组（例如文件夹、机密标签）。
5. **Op（操作）：** 允许的操作（读、写、删除）。

### 关系图

NGAC 中的访问控制是通过跟踪从用户 (U) 到对象 (O) 的路径来确定的。

````美人鱼
图解TD
    U1[用户：Alice] -->|分配给| UA1（用户属性：IT部门）
    UA1 -->|"可以读/写"| OA1（对象属性：生产服务器）
    O1[对象：应用程序服务器 1] -->|属于| OA1
    
    U2[用户：Bob] -->|分配给| UA2(用户属性：营销)
    UA2 -->|可以阅读| OA2(对象属性：公开报告)
    O2[对象：报告 Q1] -->|属于| OA2
````

> [!注意]
> 在此图中，Alice 继承了“App Server 1”上的权限，因为存在有效路径：`Alice -> IT Department -> (Read/Write) -> Production Servers <- App Server 1`。

＃＃ 协会

> [!NOTE]
> 白皮书的其余部分保留其原始语言，以保留代码和图表的语法。

ones
Las asociaciones son aristas especiales que conectan un `UA` con un `OA` y contienen las Operaciones (Op). Las aristas regulares de pertenencia no contienen operaciones.
