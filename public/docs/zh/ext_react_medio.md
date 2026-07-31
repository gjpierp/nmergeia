# React 中级：Context API，Prop Drilling 与条件渲染

随着你的组件树的增长，使用 `props`（参数）将状态从父组件向下传递给曾孙组件会变成一场架构噩梦。这种反模式被称为 **Prop Drilling（属性逐层传递）**。

## 1. 问题：Prop Drilling

```mermaid
graph TD
    App[App.jsx (拥有 theme=dark)] --> Header[Header.jsx]
    Header --> Nav[Nav.jsx]
    Nav --> Button[ThemeButton.jsx (需要 theme)]
    
    App -.->|传递 theme 但不使用它| Header
    Header -.->|传递 theme 但不使用它| Nav
    Nav -.->|最终使用了它| Button
```
`Header` 和 `Nav` 被它们不关心的属性弄脏了，违反了封装原则。

## 2. 原生解决方案：Context API

Context API 是一个全局金库，它允许任何组件（无论其深度如何）连接并直接读取数据。

### 步骤 1：创建并提供上下文 (Context)

```jsx
// ThemeContext.jsx
import React, { createContext, useState } from 'react';

// 1. 我们创建了维度传送门
export const ThemeContext = createContext();

// 2. 我们创建了提供者 Provider (状态的路由器)
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

在你的顶层 `App.jsx` 中，包裹你的应用程序：
```jsx
<ThemeProvider>
  <Header />
</ThemeProvider>
```

### 步骤 2：消费上下文 (使用 useContext)

现在，按钮可以传送到金库并获取数据，完全忽略 `Header` 和 `Nav`。

```jsx
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeButton = () => {
  // 直接从全局以太中解构
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      当前主题: {theme}
    </button>
  );
};
```

## 3. 高级条件渲染

在中型应用中，我们经常需要隐藏或显示组件。避免为此使用 CSS (`display: none`)；相反，不要在虚拟 DOM 中绘制该组件。

### 逻辑短路运算符 (&&)
当只有两种状态（显示或什么都不显示）时的首选标准。
```jsx
const LoadingSpinner = ({ isLoading }) => {
  return (
    <div>
      {/* 如果 isLoading 为 true，React 绘制 Spinner。如果为 false，则忽略该组件 */}
      {isLoading && <Spinner />}
    </div>
  );
};
```

你的武器库中有了 Context API，你就可以管理身份验证、购物车和全局主题的状态了。但是当全局业务规则变成纯粹复杂的数学计算时，Context 开始遭受渲染瓶颈。在**高级阶段**，我们将转向不可变的全局架构，如 Redux Toolkit 或 Zustand。
