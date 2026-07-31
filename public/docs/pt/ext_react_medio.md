# Context API, Prop Drilling e Renderização Condicional

À medida que a sua árvore de componentes cresce, passar um estado de um componente Pai para um componente Bisneto usando `props` (Parâmetros) se torna um pesadelo arquitetônico. Esse anti-padrão é conhecido como **Prop Drilling**.

## 1. O Problema: Prop Drilling

```mermaid
graph TD
    App[App.jsx (Tem theme=dark)] --> Header[Header.jsx]
    Header --> Nav[Nav.jsx]
    Nav --> Button[ThemeButton.jsx (Precisa de theme)]
    
    App -.->|Passa theme, mas não o usa| Header
    Header -.->|Passa theme, mas não o usa| Nav
    Nav -.->|Finalmente o usa| Button
```
O `Header` e o `Nav` ficam sujos com propriedades que não importam para eles, violando o princípio de encapsulamento.

## 2. A Solução Nativa: Context API

Context API é um cofre global que permite a qualquer componente (independentemente de sua profundidade) conectar-se e ler dados diretamente.

### Passo 1: Criar e Fornecer o Contexto

```jsx
// ThemeContext.jsx
import React, { createContext, useState } from 'react';

// 1. Criamos o portal dimensional
export const ThemeContext = createContext();

// 2. Criamos o Provedor (O Roteador do estado)
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

No seu `App.jsx` superior, você envolve seu aplicativo:
```jsx
<ThemeProvider>
  <Header />
</ThemeProvider>
```

### Passo 2: Consumir o Contexto (O useContext)

Agora, o botão pode se teletransportar para o cofre e obter os dados ignorando completamente o `Header` e o `Nav`.

```jsx
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeButton = () => {
  // Desestruturamos diretamente do éter global
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Tema Atual: {theme}
    </button>
  );
};
```

## 3. Renderização Condicional Avançada

Em aplicativos de médio porte, precisamos constantemente ocultar ou mostrar componentes. Evite usar CSS (`display: none`) para isso; em vez disso, não desenhe o componente no Virtual DOM.

### O Operador Lógico de Curto-Circuito (&&)
O padrão de fato quando há apenas dois estados (Mostrar ou Nada).
```jsx
const LoadingSpinner = ({ isLoading }) => {
  return (
    <div>
      {/* Se isLoading for true, o React desenha o Spinner. Se for false, ignora o componente */}
      {isLoading && <Spinner />}
    </div>
  );
};
```

Com a Context API em seu arsenal, você pode gerenciar estados globais de Autenticação, Carrinhos de Compra e Temas. Mas quando as regras de negócios globais se tornam matemática pura e complexa, o Context começa a sofrer gargalos de renderização. No **Nível Avançado**, passaremos para arquiteturas globais imutáveis como Redux Toolkit ou Zustand.
