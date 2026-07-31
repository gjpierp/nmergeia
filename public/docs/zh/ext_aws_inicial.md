# AWS Serverless 初级：云计算与无服务器架构

欢迎来到云端。在过去的几十年里，托管应用程序意味着租用物理服务器（裸机 Bare-Metal）。然后我们过渡到虚拟机 (EC2) 和容器 (Docker)。今天，演变的顶峰是 **Serverless (无服务器)**。

## 1. “Serverless” 是什么意思？

Serverless（无服务器）并不意味着服务器神奇地消失了。它的意思是**服务器的管理、扩展和维护对你来说是完全隐形的。**

```mermaid
graph LR
    Usuario[用户] -->|HTTP 请求| API[API Gateway]
    API -->|触发| Lambda[AWS Lambda (代码)]
    Lambda -->|查询| DB[(DynamoDB)]
    
    subgraph sub_1 ["你无需管理操作系统、补丁或 RAM"]
        API
        Lambda
        DB
    end
```

### 根本优势
* **按真实使用付费：** 如果你的应用程序在周末有 0 个用户，你支付的费用正好是 $0.00。（不像 VPS 那样 24/7 全天候收费）。
* **无限且即时的扩展：** 如果你的用户在一秒钟内从 10 个增加到 10,000 个，AWS 会自动克隆你的代码数千次，而你绝对不需要做任何事情。
* **零维护：** 你永远不必更新 Linux 版本或安装内核安全补丁。

## 2. AWS Serverless 的支柱

AWS 的 Serverless 生态系统由三个基础的乐高积木构建而成：

| 服务 | 功能 | 传统类比 |
| :--- | :--- | :--- |
| **API Gateway** | 守门人。接收 HTTP 请求，验证认证并路由。 | Nginx / Apache / Express Router |
| **AWS Lambda** | 大脑。以毫秒为单位执行你的代码 (Node.js, Python, Go)。 | 你的控制器 / 业务逻辑 |
| **DynamoDB** | 记忆。具有 1 毫秒延迟的 NoSQL 数据库。 | MongoDB / PostgreSQL |

## 3. 代码中的范式转移

在传统的 Node.js 服务器中，你通过监听一个端口来启动服务器 (`app.listen(3000)`)。在 Serverless 中，**你的代码是“沉睡的”**，直到一个事件将其唤醒。

```javascript
// 这就是一个 AWS Lambda 的样子。没有服务器，只有纯函数。
export const handler = async (event) => {
  // 'event' 包含了 API Gateway 收到的一切 (Headers, Body)
  console.log("收到的事件:", event.body);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ mensaje: "来自 Serverless 云端的问候！" }),
  };
};
```

## 后续步骤
我们已经了解 Serverless 是一种事件驱动计算 (Event-Driven Computing)。在**基础级别**中，我们将深入探索 AWS Lambda、它的时间限制以及“冷启动” (Cold Start) 概念。
