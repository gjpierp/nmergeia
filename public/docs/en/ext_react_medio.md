# Context API, Prop Drilling, and Conditional Rendering

As your component tree grows, passing state from a Parent component down to a Great-Grandchild component using `props` (Parameters) becomes an architectural nightmare. This anti-pattern is known as **Prop Drilling**.

## 1. The Problem: Prop Drilling

```mermaid
graph TD
    App[App.jsx (Has theme=dark)] --> Header[Header.jsx]
    Header --> Nav[Nav.jsx]
    Nav --> Button[ThemeButton.jsx (Needs theme)]
    
    App -.->|Passes theme but doesnt use it| Header
    Header -.->|Passes theme but doesnt use it| Nav
    Nav -.->|Finally uses it| Button
```
The `Header` and `Nav` get cluttered with properties they don't care about, violating the encapsulation principle.

## 2. The Native Solution: Context API

Context API is a global vault that allows any component (regardless of its depth) to connect and read data directly.

### Step 1: Create and Provide the Context

```jsx
// ThemeContext.jsx
import React, { createContext, useState } from 'react';

// 1. We create the dimensional portal
export const ThemeContext = createContext();

// 2. We create the Provider (The state router)
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

In your top-level `App.jsx`, you wrap your application:
```jsx
<ThemeProvider>
  <Header />
</ThemeProvider>
```

### Step 2: Consume the Context (The useContext)

Now, the button can teleport to the vault and get the data, completely ignoring the `Header` and `Nav`.

```jsx
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeButton = () => {
  // We destructure directly from the global aether
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current Theme: {theme}
    </button>
  );
};
```

## 3. Advanced Conditional Rendering

In medium-sized applications, we constantly need to hide or show components. Avoid using CSS (`display: none`) for this; instead, do not draw the component in the Virtual DOM.

### The Short-Circuit Logical Operator (&&)
The de facto standard when there are only two states (Show or Nothing).
```jsx
const LoadingSpinner = ({ isLoading }) => {
  return (
    <div>
      {/* If isLoading is true, React draws the Spinner. If false, ignores the component */}
      {isLoading && <Spinner />}
    </div>
  );
};
```

With Context API in your arsenal, you can handle Authentication, Shopping Carts, and global Theme states. But when global business rules become purely mathematical and complex, Context starts suffering from rendering bottlenecks. In the **Advanced Level**, we will move to immutable global architectures like Redux Toolkit or Zustand.
