# Context API, Prop Drilling et Rendu Conditionnel

À mesure que votre arbre de composants grandit, faire passer un état d'un composant Parent à un composant Arrière-petit-fils à l'aide de `props` (Paramètres) devient un cauchemar architectural. Cet anti-patron est connu sous le nom de **Prop Drilling**.

## 1. Le Problème : Prop Drilling

```mermaid
graph TD
    App[App.jsx (Contient theme=dark)] --> Header[Header.jsx]
    Header --> Nav[Nav.jsx]
    Nav --> Button[ThemeButton.jsx (A besoin de theme)]
    
    App -.->|Transmet theme sans lutiliser| Header
    Header -.->|Transmet theme sans lutiliser| Nav
    Nav -.->|Lutilise enfin| Button
```
Le `Header` et le `Nav` se retrouvent pollués par des propriétés qui ne les concernent pas, violant ainsi le principe d'encapsulation.

## 2. La Solution Native : Context API

Context API est un coffre-fort global qui permet à n'importe quel composant (quelle que soit sa profondeur) de se connecter et de lire directement des données.

### Étape 1 : Créer et Fournir le Contexte

```jsx
// ThemeContext.jsx
import React, { createContext, useState } from 'react';

// 1. Nous créons le portail dimensionnel
export const ThemeContext = createContext();

// 2. Nous créons le Fournisseur (Le Routeur d'état)
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

Dans votre `App.jsx` de haut niveau, vous enveloppez votre application :
```jsx
<ThemeProvider>
  <Header />
</ThemeProvider>
```

### Étape 2 : Consommer le Contexte (Le useContext)

Désormais, le bouton peut se téléporter directement dans le coffre-fort et récupérer les données en ignorant complètement le `Header` et le `Nav`.

```jsx
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeButton = () => {
  // Nous déstructurons directement depuis l'éther global
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Thème Actuel : {theme}
    </button>
  );
};
```

## 3. Rendu Conditionnel Avancé

Dans les applications de taille moyenne, nous avons constamment besoin de masquer ou d'afficher des composants. Évitez d'utiliser du CSS (`display: none`) pour cela ; préférez ne pas dessiner le composant dans le Virtual DOM.

### L'Opérateur Logique Court-Circuit (&&)
Le standard de fait lorsqu'il n'y a que deux états (Afficher ou Rien).
```jsx
const LoadingSpinner = ({ isLoading }) => {
  return (
    <div>
      {/* Si isLoading est true, React dessine le Spinner. Si c'est false, il ignore le composant */}
      {isLoading && <Spinner />}
    </div>
  );
};
```

Avec la Context API dans votre arsenal, vous pouvez gérer les états d'Authentification, de Paniers d'Achat et de Thèmes globaux. Mais lorsque les règles métier globales deviennent purement mathématiques et complexes, Context commence à souffrir de goulets d'étranglement de rendu. Au **Niveau Avancé**, nous passerons à des architectures globales immuables telles que Redux Toolkit ou Zustand.
