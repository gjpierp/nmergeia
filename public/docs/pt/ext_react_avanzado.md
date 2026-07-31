# Gestão de Estado Global (Redux Toolkit & Zustand)

A Context API do React é fantástica para dependências estáticas (como um Tema Escuro/Claro ou a Sessão do Usuário). No entanto, quando construímos Dashboards massivos (como NMergeIA) onde os dados mudam milhares de vezes por segundo (sockets, filtros, gráficos em tempo real), **o Context colapsa arquitetonicamente**.

Por quê? Porque se um valor dentro de um Context Provider mudar, **TODOS** os componentes inscritos nesse contexto serão re-renderizados instantaneamente, mesmo se precisarem apenas de uma fração minúscula desses dados.

## 1. O Surgimento dos Gerenciadores Atômicos / Flux

Precisamos de um gerenciador que permita **Seletores Seletivos**: Se um componente só precisa ler o `nome` do usuário, ele não deve ser re-renderizado se a `idade` mudar.

### Arquitetura Zustand (O padrão moderno)
O código repetitivo do Redux clássico (Actions, Reducers, Types) ficou para trás. Hoje em dia, o Zustand lidera o ecossistema por sua simplicidade e poder.

```mermaid
graph LR
    subgraph sub_1 [Zustand Store]
        Estado[(Estado Global)]
        Acciones[Mutadores (Setters)]
    end
    
    ComponenteA[Componente A (Lê Nome)] -->|Seletor Seletivo| Estado
    ComponenteB[Componente B (Muda Idade)] -->|Invoca| Acciones
    Acciones -->|Muta de forma imutável| Estado
```

## 2. Implementação de uma Store no Zustand

O Zustand permite criar um hook de estado global fora da árvore do React, eliminando a necessidade dos asfixiantes `<Provider>` no `App.jsx`.

```jsx
// store/useUserStore.js
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  // Estado Inicial
  usuario: { nome: 'Alice', idade: 25 },
  tema: 'oscuro',
  
  // Ações (Mutadores)
  setNombre: (novoNome) => set((state) => ({
    usuario: { ...state.usuario, nome: novoNome }
  })),
  
  toggleTema: () => set((state) => ({
    tema: state.tema === 'oscuro' ? 'claro' : 'oscuro'
  }))
}));
```

## 3. Seletores Cirúrgicos (O segredo do desempenho)

É aqui que o Zustand esmaga a Context API. Em nosso componente, NÃO chamaremos todo o estado, usaremos uma função de callback para extrair *apenas* o que nos importa.

```jsx
import { useUserStore } from './store/useUserStore';

export const UserBadge = () => {
  // Seletor Cirúrgico: Se 'tema' mudar, este componente NÃO será re-renderizado.
  // Ele só reagirá se 'usuario.nome' mudar.
  const nome = useUserStore((state) => state.usuario.nome);
  
  return <div className="badge">{nome}</div>;
};

export const ThemeSwitcher = () => {
  // Desestruturamos a ação mutadora
  const toggleTema = useUserStore((state) => state.toggleTema);
  
  return <button onClick={toggleTema}>Cambiar Tema</button>;
};
```

## 4. Middleware e Persistência

Estando fora do ciclo do React, esses gerenciadores permitem injetar "Middlewares" nativos com uma linha de código. Você quer que o estado sobreviva a um F5 (Recarregar a página)?

```jsx
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      filtros: [],
      addFiltro: (f) => set((s) => ({ filtros: [...s.filtros, f] }))
    }),
    {
      name: 'nmerge-storage', // O Zustand salvará e sincronizará automaticamente com o LocalStorage
    }
  )
);
```

No **Nível Especialista**, deixaremos o estado de lado e focaremos no inferno mais temido dos desenvolvedores React: O gerenciamento assíncrono profundo, o cache de requisições HTTP com React Query e SSR.
