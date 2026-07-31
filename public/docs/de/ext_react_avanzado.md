# Globales Zustandsmanagement (Redux Toolkit & Zustand)

Die Context API von React ist fantastisch für statische Abhängigkeiten (wie ein Dark/Light Theme oder die Benutzersitzung). Wenn wir jedoch massive Dashboards (wie NMergeIA) erstellen, bei denen sich die Daten tausendmal pro Sekunde ändern (Sockets, Filter, Echtzeitdiagramme), **kollabiert Context architektonisch**.

Warum? Denn wenn sich ein Wert innerhalb eines Context Providers ändert, **ALLE** Komponenten, die diesen Kontext abonniert haben, werden sofort neu gerendert, selbst wenn sie nur einen winzigen Bruchteil dieser Daten benötigen.

## 1. Das Aufkommen von atomaren Managern / Flux

Wir brauchen einen Manager, der **selektive Selektoren (Selectores Selectivos)** ermöglicht: Wenn eine Komponente nur den `nombre` (Namen) des Benutzers lesen muss, sollte sie nicht neu gerendert werden, wenn sich die `edad` (Alter) ändert.

### Zustand-Architektur (Der moderne Standard)
Vorbei ist der repetitive Code des klassischen Redux (Actions, Reducers, Types). Heutzutage führt Zustand das Ökosystem wegen seiner Einfachheit und Leistungsfähigkeit an.

```mermaid
graph LR
    subgraph sub_1 [Zustand Store]
        Estado[(Globaler Zustand)]
        Acciones[Mutatoren (Setters)]
    end
    
    ComponenteA[Komponente A (Liest Name)] -->|Selektiver Selektor| Estado
    ComponenteB[Komponente B (Ändert Alter)] -->|Ruft auf| Acciones
    Acciones -->|Mutiert unveränderlich| Estado
```

## 2. Implementierung eines Stores in Zustand

Zustand ermöglicht es, einen globalen Zustands-Hook außerhalb des React-Baums zu erstellen, wodurch die Notwendigkeit der erstickenden `<Provider>` in `App.jsx` entfällt.

```jsx
// store/useUserStore.js
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  // Initialer Zustand
  usuario: { nombre: 'Alice', edad: 25 },
  tema: 'oscuro',
  
  // Aktionen (Mutatoren)
  setNombre: (nuevoNombre) => set((state) => ({
    usuario: { ...state.usuario, nombre: nuevoNombre }
  })),
  
  toggleTema: () => set((state) => ({
    tema: state.tema === 'oscuro' ? 'claro' : 'oscuro'
  }))
}));
```

## 3. Chirurgische Selektoren (Das Geheimnis der Leistung)

Hier zerstört Zustand die Context API. In unserer Komponente rufen wir NICHT den gesamten Zustand auf, sondern verwenden eine Callback-Funktion, um *nur* das zu extrahieren, was uns interessiert.

```jsx
import { useUserStore } from './store/useUserStore';

export const UserBadge = () => {
  // Chirurgischer Selektor: Wenn sich 'tema' ändert, wird diese Komponente NICHT neu gerendert.
  // Sie reagiert nur, wenn sich 'usuario.nombre' ändert.
  const nombre = useUserStore((state) => state.usuario.nombre);
  
  return <div className="badge">{nombre}</div>;
};

export const ThemeSwitcher = () => {
  // Wir destrukturieren die Mutator-Aktion
  const toggleTema = useUserStore((state) => state.toggleTema);
  
  return <button onClick={toggleTema}>Thema ändern</button>;
};
```

## 4. Middleware und Persistenz

Da diese Manager außerhalb des React-Zyklus liegen, ermöglichen sie die Injektion nativer "Middlewares" mit einer einzigen Codezeile. Willst du, dass der Zustand ein F5 (Neuladen der Seite) überlebt?

```jsx
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      filtros: [],
      addFiltro: (f) => set((s) => ({ filtros: [...s.filtros, f] }))
    }),
    {
      name: 'nmerge-storage', // Zustand speichert und synchronisiert automatisch mit LocalStorage
    }
  )
);
```

Auf der **Expertenstufe (Nivel Experto)** werden wir den Zustand beiseite lassen und uns auf die am meisten gefürchtete Hölle der React-Entwickler konzentrieren: Tiefes asynchrones Handling, Caching von HTTP-Anfragen mit React Query und SSR.
