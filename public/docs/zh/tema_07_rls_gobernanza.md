# 数据层安全性 (RLS)

行级安全性 (RLS) 将应用程序的租户过滤逻辑直接传输到数据库。

## Postgres 中 RLS 的优点
任何在没有租户 ID 的情况下执行“SELECT * FROM Invoices”的恶意查询都将返回 0 行。

## 治理和政策
使用“ALTER TABLE Invoices ENABLE ROW LEVEL SECURITY;”启用 RLS 策略。

````美人鱼
图解TD
  A[查询：SELECT * FROM 用户] --> B{RLS 策略}
  B -->|租户 ID 匹配| C[返回 10 行]
  B -->|没有匹配| D[返回 0 行]
````

> [!NOTE]
> 白皮书的其余部分保留其原始语言，以保留代码和图表的语法。

