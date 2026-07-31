# Context API, Prop Drilling und bedingtes Rendern

Wenn dein Komponentenbaum wächst, wird das Weitergeben eines Zustands von einer Elternkomponente (Padre) an eine Urenkelkomponente (Bisnieto) über `props` (Parameter) zu einem architektonischen Albtraum. Dieses Anti-Pattern ist als **Prop Drilling** bekannt.

## 1. Das Problem: Prop Drilling

```mermaid
graph TD
    App[App.jsx (Hat theme=dark)] --> Header[Header.jsx]
    Header --> Nav[Nav.jsx]
    Nav --> Button[ThemeButton.jsx (Benötigt theme)]
    
    App -.->|Gibt theme weiter, nutzt es aber nicht| Header
    Header -.->|Gibt theme weiter, nutzt es aber nicht| Nav
    Nav -.->|Nutzt es schließlich| Button
```
Der `Header` und die `Nav` werden mit Eigenschaften verunreinigt, die sie nicht interessieren, was das Kapselungsprinzip verletzt.

## 2. Die native Lösung: Context API

Die Context API ist ein globaler Tresor, der es jeder Komponente (unabhängig von ihrer Tiefe) ermöglicht, sich zu verbinden und Daten direkt zu lesen.

### Schritt 1: Den Kontext erstellen und bereitstellen (Provider)

```jsx
// ThemeContext.jsx
import React, { createContext, useState } from 'react';

// 1. Wir erstellen das dimensionale Portal
export const ThemeContext = createContext();

// 2. Wir erstellen den Provider (Den Router des Zustands)
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

In deiner obersten `App.jsx` umhüllst du deine Anwendung:
```jsx
<ThemeProvider>
  <Header />
</ThemeProvider>
```

### Schritt 2: Den Kontext konsumieren (Das useContext)

Jetzt kann sich der Button zum Tresor teleportieren und die Daten abrufen, wobei `Header` und `Nav` vollständig ignoriert werden.

```jsx
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeButton = () => {
  // Wir destrukturieren direkt aus dem globalen Äther
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Aktuelles Theme: {theme}
    </button>
  );
};
```

## 3. Fortgeschrittenes bedingtes Rendern

In mittelgroßen Anwendungen müssen wir Komponenten ständig ausblenden oder einblenden. Vermeide die Verwendung von CSS (`display: none`) dafür; zeichne stattdessen die Komponente nicht im Virtual DOM.

### Der logische Kurzschlussoperator (&&)
Der De-facto-Standard, wenn es nur zwei Zustände gibt (Anzeigen oder Nichts).
```jsx
const LoadingSpinner = ({ isLoading }) => {
  return (
    <div>
      {/* Wenn isLoading true ist, zeichnet React den Spinner. Wenn es false ist, ignoriert es die Komponente */}
      {isLoading && <Spinner />}
    </div>
  );
};
```

Mit der Context API in deinem Arsenal kannst du Authentifizierungszustände, Einkaufswagen und globale Themes verwalten. Aber wenn globale Geschäftsregeln reine und komplexe Mathematik werden, beginnt Context unter Rendering-Engpässen zu leiden. Auf der **Fortgeschrittenen Stufe (Nivel Avanzado)** werden wir zu unveränderlichen globalen Architekturen wie Redux Toolkit oder Zustand übergehen.
