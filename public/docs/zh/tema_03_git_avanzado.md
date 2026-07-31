# 高级 Git 工作流程

大规模协作需要高效的分支策略。

## 基于主干的开发与 GitFlow
- **基于主干：**直接持续集成到“main”。需要*功能标志*和严格的 TDD。减少冲突。
- **GitFlow：** 严格版本控制的理想选择（“develop”、“release”、“main”）。

## Git Hooks 和 Husky
Husky 允许您在提交代码之前运行脚本（例如 Linting、Prettier、单元测试）。

````美人鱼
gitGraph
  提交
  分支特征/A
  结账功能/A
  提交
  主要结账
  合并特征/A
  提交 ID：“v1.0” 标签：“发布”
````

> [!NOTE]
> 白皮书的其余部分保留其原始语言，以保留代码和图表的语法。

