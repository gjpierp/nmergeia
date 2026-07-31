# React 高级：全局状态管理 (Redux Toolkit & Zustand)

React 的 Context API 非常适合处理静态依赖项（如深色/浅色主题或用户会话）。然而，当我们构建大规模的仪表板（如 NMergeIA）时，数据每秒可能发生数千次变化（通过 sockets、过滤器、实时图表），**Context 就会在架构上崩溃**。

为什么？因为如果一个 Context Provider 中的值发生变化，**所有**订阅了该上下文的组件都会立即重新渲染，即使它们只需要这些数据中极其微小的一部分。

## 1. 原子化管理器 (Gestores Atómicos) / Flux 的崛起

我们需要一个允许**选择性选择器 (Selectores Selectivos)**的管理器：如果一个组件只需要读取用户的 `nombre`（名字），那么如果用户的 `edad`（年龄）发生变化，它就不应该重新渲染。

### Zustand 架构（现代标准）
经典的 Redux 样板代码（Actions, Reducers, Types）已经成为过去。如今，Zustand 因其简单和强大而引领生态系统。

```mermaid
graph LR
    subgraph sub_1 [Zustand Store]
        Estado[(全局状态)]
        Acciones[修改器 (Setters)]
    end
    
    ComponenteA[组件 A (读取名字)] -->|选择性选择器| Estado
    ComponenteB[组件 B (修改年龄)] -->|调用| Acciones
    Acciones -->|不可变地修改| Estado
```

## 2. 在 Zustand 中实现一个 Store

Zustand 允许在 React 树之外创建一个全局状态 hook，从而消除了在 `App.jsx` 中放置令人窒息的 `<Provider>` 的需要。

```jsx
// store/useUserStore.js
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  // 初始状态
  usuario: { nombre: 'Alice', edad: 25 },
  tema: 'oscuro',
  
  // 动作 (修改器)
  setNombre: (nuevoNombre) => set((state) => ({
    usuario: { ...state.usuario, nombre: nuevoNombre }
  })),
  
  toggleTema: () => set((state) => ({
    tema: state.tema === 'oscuro' ? 'claro' : 'oscuro'
  }))
}));
```

## 3. 外科手术般的选择器 (性能的秘密)

这就是 Zustand 击败 Context API 的地方。在我们的组件中，我们**不会**调用整个状态，我们将使用一个回调函数来提取*唯一*我们关心的部分。

```jsx
import { useUserStore } from './store/useUserStore';

export const UserBadge = () => {
  // 外科手术选择器: 如果 'tema' (主题) 改变，这个组件**不会**重新渲染。
  // 它只会在 'usuario.nombre' 改变时作出反应。
  const nombre = useUserStore((state) => state.usuario.nombre);
  
  return <div className="badge">{nombre}</div>;
};

export const ThemeSwitcher = () => {
  // 我们解构出动作修改器
  const toggleTema = useUserStore((state) => state.toggleTema);
  
  return <button onClick={toggleTema}>切换主题</button>;
};
```

## 4. 中间件与持久化

因为在 React 生命周期之外，这些管理器允许使用一行代码注入原生的“中间件”。想让状态在 F5（页面刷新）后存活下来吗？

```jsx
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      filtros: [],
      addFiltro: (f) => set((s) => ({ filtros: [...s.filtros, f] }))
    }),
    {
      name: 'nmerge-storage', // Zustand 将自动保存并同步到 LocalStorage
    }
  )
);
```

在**专家级别**中，我们将抛开状态管理，转而关注 React 开发者最害怕的地狱：深层异步处理，使用 React Query 缓存 HTTP 请求，以及 SSR (服务端渲染)。
