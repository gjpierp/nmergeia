# Global State Management (Redux Toolkit & Zustand)

The React Context API is fantastic for static dependencies (like a Dark/Light Theme or User Session). However, when building massive Dashboards (like NMergeIA) where data changes thousands of times per second (sockets, filters, real-time charts), **Context collapses architecturally**.

Why? Because if a value inside a Context Provider changes, **ALL** components subscribed to that context instantly re-render, even if they only need a tiny fraction of that data.

## 1. The Rise of Atomic / Flux Managers

We need a manager that allows **Selective Selectors**: If a component only needs to read the user's `name`, it shouldn't re-render if the `age` changes.

### Zustand Architecture (The modern standard)
The repetitive boilerplate code of classic Redux (Actions, Reducers, Types) is gone. Today, Zustand leads the ecosystem due to its simplicity and power.

```mermaid
graph LR
    subgraph sub_1 [Zustand Store]
        State[(Global State)]
        Actions[Mutators (Setters)]
    end
    
    ComponentA[Component A (Reads Name)] -->|Selective Selector| State
    ComponentB[Component B (Changes Age)] -->|Invokes| Actions
    Actions -->|Mutates immutably| State
```

## 2. Implementing a Store in Zustand

Zustand allows you to create a global state hook outside the React tree, eliminating the need for suffocating `<Provider>` wrappers in `App.jsx`.

```jsx
// store/useUserStore.js
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  // Initial State
  user: { name: 'Alice', age: 25 },
  theme: 'dark',
  
  // Actions (Mutators)
  setName: (newName) => set((state) => ({
    user: { ...state.user, name: newName }
  })),
  
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'dark' ? 'light' : 'dark'
  }))
}));
```

## 3. Surgical Selectors (The secret to performance)

This is where Zustand crushes the Context API. In our component, we will NOT call the whole state; we will use a callback function to extract *only* what we care about.

```jsx
import { useUserStore } from './store/useUserStore';

export const UserBadge = () => {
  // Surgical Selector: If 'theme' changes, this component will NOT re-render.
  // It will only react if 'user.name' changes.
  const name = useUserStore((state) => state.user.name);
  
  return <div className="badge">{name}</div>;
};

export const ThemeSwitcher = () => {
  // We destructure the mutator action
  const toggleTheme = useUserStore((state) => state.toggleTheme);
  
  return <button onClick={toggleTheme}>Switch Theme</button>;
};
```

## 4. Middleware and Persistence

Being outside the React lifecycle, these managers allow injecting native "Middlewares" with a single line of code. Do you want the state to survive an F5 (Page Reload)?

```jsx
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      filters: [],
      addFilter: (f) => set((s) => ({ filters: [...s.filters, f] }))
    }),
    {
      name: 'nmerge-storage', // Zustand will automatically save and sync with LocalStorage
    }
  )
);
```

In the **Expert Level**, we will leave state behind and focus on the most dreaded hell for React developers: Deep asynchronous handling, HTTP request caching with React Query, and SSR.
